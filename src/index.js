const {Builder, By, Key, until} = require('selenium-webdriver');

const example = async () => {
    let driver = await new Builder().forBrowser('chrome').build();
    try {

        await driver.manage().setTimeouts({implicit: 1000});
        // await driver.get('https://www.kebhana.com/cont/mall/mall15/mall1501/index.jsp');
        await driver.get('https://www.kebhana.com/cms/rate/index.do?contentUrl=/cms/rate/wpfxd651_01i.do#//HanaBank');
        let menu = driver.findElement(By.css('ul'));
        menu = await menu.findElements(By.css('li'));
        console.warn('-----')
        for (let e of menu) {
            console.log(await e.getText());
        }
        console.warn('-----')
        let mb30Menu = await driver.findElements(By.className('mb30'));
        for (let e of mb30Menu) {
            console.log(await e.getText());
        }


        let priceList = await driver.findElements(By.css('td'));
        for (let e of priceList) {
            console.log(await e.getText());
        }

    } finally {
        driver.quit();
    }
}

example();