const os = require("os");
const fs = require('fs');
const path = require("path");
const utils = require("./utils.js");
const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const rootDir = path.join(os.homedir(), ".track-gmaps");
const outputFile = path.join(rootDir, "informations.csv");

if (!fs.existsSync(path.join(rootDir, "config.json"))) {
    console.error(`Please create a config file into ${rootDir}. It may contains places information.`);
    process.exit(1);
}

const config = require(path.join(rootDir, "config.json"));


if (!fs.existsSync(path.dirname(outputFile))) {
    fs.mkdirSync(path.dirname(outputFile));
}

const csvWriter = createCsvWriter({
    path: outputFile,
    header: [
        { id: 'name', title: 'NAME' },
        { id: 'actual', title: 'ACTUAL' },
        { id: 'expected', title: 'EXPECTED' },
        { id: 'date', title: 'DATE' },
    ],
    append: true
});

(async () => {
    const browser = await puppeteer.launch({ ignoreHTTPSErrors: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent(config.userAgent);
    await page.setViewport({ width: 769, height: 711 });

    for (let i = 0; i < config.places.length; i++) {
        await page.goto(config.places[i].url, { waitUntil: 'networkidle2' });
        await page.mouse.move(590, 338); // move mouse pointer to trigger a hover event in the gmaps
        await utils.delay(3000);
        await page.mouse.click(590, 338); // click and open place's information
        await utils.delay(15000);

        const tzoffset = (new Date()).getTimezoneOffset() * 60000;
        const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        const informations = await page.evaluate(utils.fetchInformations); // extract movement informations
        const movements = utils.extractMovementPercentage(informations);

        await csvWriter.writeRecords([{
            name: config.places[i].name,
            actual: movements.actual,
            expected: movements.expected,
            date: localISOTime + config.timeZone,
        }]);
    }

    await browser.close();
})();

