var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

/* Parse fetched data */
function parseHTML(html){
    let $ = cheerio.load(html);
    return $;
}
/* Fetch data from source */
function scraper(url) {
    return new Promise(function(resolve, reject) {
        if (!url) {
            return reject(new Error("URL must be specified"));
        }

        request(url, function(err, res, html) {
            if (err) {
                return reject(err);
            } else {
                let urlInfo = parseHTML(html);
                if (!urlInfo)
                    return reject(new Error("Invalid URL"));
                    // console.log(urlInfo)
                resolve(urlInfo);
            }
        });
    });
}
/* Object for scraped Data */
class ScrapedData {
    constructor(url, info={}) {
        /* Overwrites default ad properties */
        let overwriteProps = (info) => {
            this.info = info;
        }

        // Overwrite with passed info
        overwriteProps(info);
    }

    /* Creates an object by scraping the passed URL */
    static Get(url, callback) {
        let promise = scraper(url).then(function(info) {
            return new ScrapedData(url, info, true);
        });

        if (callback)
            promise.then((ad) => callback(null, ad), callback);
        return promise;
    }
}


/* Data Sources */
url = 
{
    kijiji: "https://www.kijiji.ca/b-real-estate/kitchener-waterloo/apartment/k0c34l1700212"
};

/* Manipulate data */
// TODO: Interpret the data structure on Kijiji
ScrapedData.Get(url.kijiji).then(function(rawdata) {
    // Use the scraped data object
    let scrapedData = rawdata.info;
    scrapedData('.title_wrapper').filter(function(){

                var data = scrapedData(this);

                title = data.children().first().text();
                console.log(data.children().first().text());
        })
}).catch(console.error);

module.exports = 
{
    app
}