# Documentação

1. Pré-requisitos
2. Configuração
3. Utilização


## 1 - Pré-requisitos

O projeto foi escritos com JavaScript e deve ser executado com o NodeJS de versão igual ou superior a `v10.15.3`. O projeto _ainda_ não foi testado no ambiente Windows, então proceda com cuidado.

Para instalar as dpendências siga os passos:

- Clone este repositório;
    ```shell
    $ git clone https://github.com/puppeteer/puppeteer.git
    ```
- Entre no diretório recém clonado;
- Instale as dependências:
    ```shell
    $ npm install
    ```

## 2 - Configuração

Antes de executar a aplicação é necessário configura-la. Os próximos passos devem se seguidos a risca:

- Na raiz do projeto renomeie o arquivo `config.sample.json` para `config.json`. 
- Abra o arquivo `config.json` e verifique que existe uma propriedade chamada `places`. Esta propriedade representa deve conter a lista de locais que serão monitorados.
    - Cada local da lista deve possuir ao menos duas variáveis: `{name: "Nome do local", url: "coordenadas precisas do gmaps em formato de url"}`.
    - A configuração de exemplo aponta para um supermercado na zona sul de São Paulo. Note que ao abrir o link em uma janela com `700px por 700px` o estabelecimento fica posicionado mais a deira (*isso é essencial - retomaremos a este tópico*).
- Adicione outro um local que você quer monitorar:
    - Abra o google maps, busque pelo estabelecimento em uma janela menor que `1024 por 860`.
    - Defina a variável `Z` do Google Maps no valor de `20Z` como na imagem abaixo;
    - Posicione o estabelecimento mais a esquerda [Local mais a esquerda](config-place-1.png);
    - Clique no nome do local, [observe que ele foi movido mais para a direta](config-place-2.png);
    - Você deve ter obtido uma URL como esta `https://www.google.com/maps/place/Parque+Ibirapuera/@-23.5879755,-46.6587579,20z/data=!4m5!3m4!1s0x94ce599eda9b7357:0xd76d92a8fcec30f!8m2!3d-23.5879755!4d-46.6584843`;
    - Você deve manter apenas as informações relevantes (latitude e longitude), então a URL final deve ser como esta: `https://www.google.com/maps/@-23.5879755,-46.6587579,20z`
    - Finalmente adicione o novo local ao arquivo de configurações.

- Após os passos acima você deve ter o seguinte arquivo de configurações:
    ```json
    {
        "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
        "timeZone": "-03",
        "places": [
            {
                "name": "Carrefour Express JB",
                "url": "https://www.google.com/maps/@-23.6163197,-46.6393005,20z",
                "group": "Praça da Árvore"
            },
            {
                "name": "Parque do Ibirapuera",
                "url": "https://www.google.com/maps/@-23.5879755,-46.6587579,20z"
            }
        ]
    }
    ```

## 3 - Utilização

O programa está apto a ser executado, você pode simplesmente executar o comando:

```shell
$ npm run start
```

Após a execução você deve ter o arquivo `$HOME/.track-gmaps/informations.csv` com as informações extraídas. Verifique os dados extraídos:

```shell
$ cat $HOME/.track-gmaps/informations.csv

Carrefour Express JB,0,0,2020-04-27T22:59:56.851-03
Parque do Ibirapuera,0,0,2020-04-27T23:00:17.715-03
```