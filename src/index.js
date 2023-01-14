const getHanaData = require('./selenium/selenium_example');

getHanaData();

setInterval(() => {
    getHanaData();
}, 3600000);
