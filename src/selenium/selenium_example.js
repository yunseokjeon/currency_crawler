const {Builder, By, Key, until} = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const axios = require('axios');

const readToken = () => {
    let json = require('../../resources/token.json');
    return json.token;
}

const slackRun = async (messageText) => {

    // https://www.codeproject.com/Articles/1272963/Writing-to-a-Slack-Channel-Node-js-Edition-4

    const url = 'https://slack.com/api/chat.postMessage';
    const post = {
        channel: "#currency",
        text: messageText
    }
    const accessToken = readToken();
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
    };

    try {
        const response = await axios.post(url, post, {headers: headers});
        console.log(` Response code: ${response.status}`);
    } catch (e) {
        console.log(`Error posting message: ${e}`);
    }

}

const getHanaData = async () => {
    let driver = await new Builder().forBrowser('chrome').build();

    /*
    for Docker image
    let builder = new Builder().forBrowser('chrome');
    let options = new Options();
    options.headless();
    options.excludeSwitches(['enable-logging']);
    options.addArguments(['--no-sandbox']);
    let driver = await builder.setChromeOptions(options).build();*/

    try {
        await driver.manage().setTimeouts({implicit: 1000});
        // await driver.get('https://www.kebhana.com/cont/mall/mall15/mall1501/index.jsp');
        await driver.get('https://www.kebhana.com/cms/rate/index.do?contentUrl=/cms/rate/wpfxd651_01i.do');
        let menu = driver.findElement(By.css('ul'));
        menu = await menu.findElements(By.css('li'));
        let mb30Menu = await driver.findElements(By.className('mb30'));
        let priceList = await driver.findElements(By.css('td'));

        const container = [];
        let flag = false, count = 0;
        for (let e of priceList) {
            const candidate = await e.getText();
            if (candidate === '미국 USD') {
                flag = true;
                continue;
            }

            if (flag && count < 11) {
                container.push(await e.getText());
                count++;
            }
        }

        const result = [];
        result.push('미국 USD');

        for (let i = 0; i < container.length; i++) {
            let element = '';

            if (i === 0) {
                element += '현찰 사실 때 환율 : ';
            } else if (i === 1) {
                element += '현찰 사실 때 Spread : ';
            } else if (i === 2) {
                element += '현찰 파실 때 환율 : ';
            } else if (i === 3) {
                element += '현찰 파실 때 Spread : ';
            } else if (i === 4) {
                element += '송금 보낼 때 : ';
            } else if (i === 5) {
                element += '송금 받을 때 : ';
            } else if (i === 6) {
                element += 'T/C 사실 때 : ';
            } else if (i === 7) {
                element += '외화 수표 파실 때 : ';
            } else if (i === 8) {
                element += '매매 기준율 : ';
            } else if (i === 9) {
                element += '환가료율 : ';
            } else if (i === 10) {
                element += '미화환산율 : '
            }
            element += container[i];
            result.push(element);
        }

        let slackMessage = '';
        for (const candidate of result) {
            slackMessage += (candidate + '\n');
        }

        slackRun(slackMessage);

    } finally {
        driver.quit();
    }
}

module.exports = getHanaData;