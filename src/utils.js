const delay = (time) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

const fetchInformations = () => {
    let el = document.querySelectorAll('div[aria-label*="Movimento atual"]');
    if (el === undefined || el.length == 0) {
        return "Sem movimento capturado..";
    }
    return el[0].getAttribute("aria-label");
}

const extractMovementPercentage = (string) => {
    const regex = /(\d{1,3})/gm;
    const match = string.match(regex);

    if (match == null) {
        return { actual: 0, expected: 0 }
    } else if (match.length < 2) {
        console.warn(`Could not detect the two percentage during movement extract. The value extracted is '${match}'.`)
    }

    return { actual: match[0], expected: match[1] }
}


module.exports = {
    "delay": delay,
    "fetchInformations": fetchInformations,
    "extractMovementPercentage": extractMovementPercentage
}