var linkListAmazon = require('./linkListAmazon');
var linkListUnieuro = require('./linkListUnieuro');
var linkListMediaworld = require('./linkListMediaworld');
var linkListCarrefour = require('./linkListCarrefour');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
var express = require('express');


 puppeteer.use(StealthPlugin())
 puppeteer.use(AdblockerPlugin({ blockTrackers: true }))


 var app = express();

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});



//const iPhone = puppeteer.devices['iPhone 6'];
let the_interval = 3 * 60 * 1000;
the_interval_test = 0.01 * 60 * 1000;
const open = require('open');


let linksAmazon = linkListAmazon;
let linksUnieuro = linkListUnieuro;
let linksMediaworld = linkListMediaworld;
let linksCarrefour = linkListCarrefour;


console.log('Starting...');


// let checked = 0;
// amazonScraper(linksAmazon[0], linksAmazon.length - 1, checked);



// Amazon
  setInterval(function () {

let checked = 0;
amazonScraper(linksAmazon[0], linksAmazon.length - 1, checked);


for (let n = 0; n < linksUnieuro.length; n++) {
   unieuroScraper(linksUnieuro[n]);
 }


  }, the_interval);






function amazonScraper(link, last, checked) {


   (async () => {
      //AVVIO
      const browser = await puppeteer.launch({
         args: [
           '--incognito',
           '--no-sandbox', 
           '--disable-setuid-sandbox'
         ],
       }); //{headless: false} 
      const page = await browser.newPage();
      //await page.emulate(iPhone);
      await page.goto(link.link);

      console.log('Inizio Scraping Amazon, going to link: ', link.link);


      //COOKIE
        try {
          var el = await page.waitForSelector('#sp-cc-accept', {timeout: 1000}).catch(err => {
             console.log("cookie timeout, probable bot control")
            if (!shouldClose(last, checked)) {
               checked += 1;
               amazonScraper(linksAmazon[checked], last, checked);
            }
          }
          );
          await page.click(el._remoteObject.description);
   

         // CONTROLLO DISPONIBILITA'
         let spanElement = await page.$$('#availability > span');
         spanElement = await spanElement.pop();
         spanElement = await spanElement.getProperty('innerText');
         value = await spanElement.jsonValue();

         if (link.store == 'it') {
            if (value.startsWith('Disponibilit')) {
               console.log('\x1b[42m%s\x1b[0m', link.productName + ' DISPONIBILE' + '|| link: ' + link.link);
               // open(link.link);
               if (!shouldClose(last, checked)) {
                  checked += 1;
                  amazonScraper(linksAmazon[checked], last, checked);
               }
            } else {
               console.log('\x1b[41m%s\x1b[0m', link.productName + ' - NON DISPONIBILE - ricerca del :  ' + createTodayDate());
               if (!shouldClose(last, checked)) {
                  checked += 1;
                  amazonScraper(linksAmazon[checked], last, checked);
               }
            }
         } else if (link.store == 'de') {
            if (!value.startsWith('Derzeit nicht verfügbar') && value != '') {
               console.log('\x1b[42m%s\x1b[0m', link.productName + ' DISPONIBILE' + '|| link: ' + link.link);
               // open(link.link);
               if (!shouldClose(last, checked)) {
                  checked += 1;
                  amazonScraper(linksAmazon[checked], last, checked);
               }
            } else {
               console.log('\x1b[41m%s\x1b[0m', link.productName + ' - NON DISPONIBILE - ricerca del :  ' + createTodayDate());
               if (!shouldClose(last, checked)) {
                  checked += 1;
                  amazonScraper(linksAmazon[checked], last, checked);
               }
            }
         } else if (link.store == 'es') {
            if (!value.startsWith('No disponible') && value != '' && !value.startsWith('Envío en') && value != '') {
               console.log('\x1b[42m%s\x1b[0m', link.productName + ' DISPONIBILE' + '|| link: ' + link.link);
               // open(link.link);
               if (!shouldClose(last, checked)) {
                  checked += 1;
                  amazonScraper(linksAmazon[checked], last, checked);
               }
            } else {
               console.log('\x1b[41m%s\x1b[0m', link.productName + ' - NON DISPONIBILE - ricerca del :  ' + createTodayDate());
               if (!shouldClose(last, checked)) {
                  checked += 1;
                  amazonScraper(linksAmazon[checked], last, checked);
               }
            }

         } else if (link.store == 'uk') {
            if (!value.startsWith('Currently unavailable') && value != '') {
               console.log('\x1b[42m%s\x1b[0m', link.productName + ' DISPONIBILE' + '|| link: ' + link.link);
               // open(link.link);
               if (!shouldClose(last, checked)) {
                  checked += 1;
                  amazonScraper(linksAmazon[checked], last, checked);
               }
            } else {
               console.log('\x1b[41m%s\x1b[0m', link.productName + ' - NON DISPONIBILE - ricerca del :  ' + createTodayDate());
               if (!shouldClose(last, checked)) {
                  checked += 1;
                  amazonScraper(linksAmazon[checked], last, checked);
               }
            }
         }
         await browser.close();

        } catch (e) {
           await browser.close();
         }


   })();
}



function unieuroScraper(link) {

   (async () => {
      console.log('Inizio Scraping Unieuro...');

         const browser = await puppeteer.launch({
            args: [
              '--incognito',
              '--no-sandbox', 
              '--disable-setuid-sandbox'
            ],
          }); //{headless: false} 
         const page = await browser.newPage();
         //await page.emulate(iPhone);
         await page.goto(link.link);
   
         //COOKIE
           try {
             var el = await page.waitForSelector('#onetrust-accept-btn-handler', {timeout: 1000}).catch(err => {
                console.log('Errore di cookie');
             }
             );
             await page.click(el._remoteObject.description);

         // CONTROLLO DISPONIBILITA'
         let spanElement = await page.$$('div.available > span.message');
         spanElement = spanElement.pop();
         spanElement = await spanElement.getProperty('innerText');
         spanElement = await spanElement.jsonValue();
         if (spanElement != "Non Disponibile") {
            console.log('\x1b[42m%s\x1b[0m', link.productName + ' DISPONIBILE');
            open(link.link);
         } else {
            console.log('\x1b[41m%s\x1b[0m', link.productName + ' - NON DISPONIBILE - ricerca del :  ' + createTodayDate());
         }
         await browser.close();
      } catch (e) { console.log(e)}

   })();

}


function mediaworldScraper(link) {

   (async () => {

      try {
         //AVVIO
         const browser = await puppeteer.launch();
         const page = await browser.newPage();
         await page.goto(link.link);

         //COOKIE
         var el = await page.waitForSelector('#onetrust-accept-btn-handler');
         await el.evaluate(el => el.click());


         // CONTROLLO DISPONIBILITA'
         let element = await page.$$('#block-mw-theme-content > div > div > div > div > div.main-content > div.search-product-list > div.search-product-list-content > article');
         let spanElement = await element[0].$$(' h3.product-name > a');
         spanElement = spanElement.pop();
         spanElement = await spanElement.getProperty('innerText');
         spanElement = await spanElement.jsonValue();
         spanElement = spanElement.toString().toLocaleLowerCase();

         if (spanElement.includes('digital') || spanElement.includes('standard')) {
            console.log('\x1b[42m%s\x1b[0m', link.productName + ' DISPONIBILE');
            open(link.link);
         } else {
            console.log('\x1b[41m%s\x1b[0m', link.productName + ' - NON DISPONIBILE - ricerca del :  ' + createTodayDate());
         }
         await browser.close();

      } catch (e) { }

   })();

}

function carrefourScraper(link) {

   (async () => {

      try {
         //AVVIO
         const browser = await puppeteer.launch();
         const page = await browser.newPage();
         await page.goto(link.link);
         if (page.url() === link.link) {
            console.log('\x1b[42m%s\x1b[0m', link.productName + ' DISPONIBILE');
            open(link.link);
         }
         else {
            console.log('\x1b[41m%s\x1b[0m', link.productName + ' - NON DISPONIBILE - ricerca del :  ' + createTodayDate());
         }
         await browser.close();
      } catch (e) { }

   })();

}



createTodayDate = function () {
   let today = new Date();
   let hour = today.getHours();
   let minutes = today.getMinutes();
   let seconds = today.getSeconds();

   if (minutes < 10) {
      minutes = '0' + minutes;
   }

   if (seconds < 10) {
      seconds = '0' + seconds;
   }

   if (hour < 10) {
      hour = '0' + hour;
   }

   let time = hour + ':' + minutes + ':' + seconds;
   return today = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() + ' || ' + time;
}


function shouldClose(last, checked) {
   if (checked == last) {
      return true;
   } else return false;
}

