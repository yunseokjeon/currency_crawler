const axios = require('axios');
const cheerio = require('cheerio');

const example = async () => {
    // const response = await axios.get('https://www.kebhana.com/cms/rate/index.do?contentUrl=/cms/rate/wpfxd651_01i.do');
    const response = await axios.get('https://cheerio.js.org/');
    const $ = cheerio.load(response.data);
    const elements = $('div');
    console.log('start');
    console.log(elements);
    elements.each((index, element) => {
        console.log($(element).text());
    });
}

module.exports = example;