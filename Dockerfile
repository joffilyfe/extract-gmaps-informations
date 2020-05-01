FROM node:10.20-alpine

LABEL maintainer="joffily.ferreira@scielo.org"

RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" > /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/v3.11/main" >> /etc/apk/repositories \
    && apk upgrade -U -a \
    && apk add --no-cache \
    libstdc++ \
    chromium \
    harfbuzz \
    nss \
    freetype \
    ttf-freefont \
    tzdata \
    tini \
    && rm -rf /var/cache/* \
    && mkdir /var/cache/apk \
    && cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime \
    && echo "America/Sao_Paulo" >  /etc/timezone \
    && apk del tzdata \
    && crontab -r

# Run Chrome as non-privileged
ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/ \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY . /app
WORKDIR /app

RUN adduser -D chrome \
    && chown -R chrome:chrome /app \
    && chmod 755 /app/.docker/start.sh \
    && /usr/bin/crontab /app/.docker/crontab.txt

RUN npm install \
    && mkdir -p /home/chrome/.track-gmaps /root/.track-gmaps \
    && mv config.sample.json /root/.track-gmaps/config.json \
    && chown -R chrome:chrome /app \
    && chown -R chrome:chrome /home/chrome/.track-gmaps

RUN touch /var/log/cron.log \
    && chown -Rf chrome:chrome /var/log/cron.log \
    && ln -sf /dev/stdout /var/log/cron.log

CMD ["crond", "-f"]