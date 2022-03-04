const request = require('superagent');
const cheerio = require('cheerio');
const Listing = require('../models/Listing.js');
const { sendMessage } = require('./SMSTwilio.js');
const { isValidListing } = require('./isValidListing.js');

const searchLink = 'https://gridpm.appfolio.com/listings?1646370504793&filters%5Bproperty_list%5D=Residential&theme_color=%23005290&filters%5Border_by%5D=date_posted&iframe_id=af_iframe_0';

const scrapeGridProperties = async(currentIdsStored) => {
  const timeStamp = new Date();
  await request(searchLink)
  .set('origin', 'true')
  .set('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36')
  .then(response => {
    if(response.statusCode == 200) {
      const html = response.text;
      const $ = cheerio.load(html);

      $('.listing-item').each((i, element) => {
        const price = $(element)
          .find("dt:contains('RENT') + dd")
          .text()
          .replace(/\D/g, '') || 0;

        const bed = $(element)
          .find("dt:contains('Bed') + dd")
          .text()
          .substring(0, 1);

        const bath = 1;

        const squareFeet = $(element)
          .find("dt:contains('Square Feet') + dd")
          .text()
          .replace(/\D/g, '') || 0;

        const address = $(element)
          .find('.js-listing-address')
          .text()

        const id = $(element)
          .attr('id')
          .replace(/\D/g, '');

        const link = 'https://gridpm.appfolio.com' + $(element)
          .find('a')
          .attr('href');

        const listing = {
          id,
          source: 'Grid Properties',
          address,
          link,
          price,
          squareFeet,
          bed,
          bath,
          scrapeTimestamp: timeStamp
        };
        console.log(listing);
        
        const duplicateEntry = currentIdsStored.find(id => id === listing.id);
        console.log(duplicateEntry ? 'yes a dupe' : 'not dupe');
        if(isValidListing(listing) && !duplicateEntry){
          console.log('written to db');
          Listing.insert(listing);
          sendMessage(constructMessage(listing));
        }
      });
    }
  });
}

module.exports = {
    scrapeGridProperties
  };
