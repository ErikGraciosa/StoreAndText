const Throttle = require('superagent-throttle');
const request = require('superagent');
const cheerio = require('cheerio');
const Listing = require('../models/Listing.js');
//const { sendText } = require('../utils/sendText');
const pool = require('../utils/pool');
const { sendMessage } = require('./SMSTwilio.js');
const { Message } = require('twilio/lib/twiml/MessagingResponse');
const { okToScrape } = require('./runScrapeScrambler.js');

const timeStamp = new Date();
const throttle = new Throttle({ rate: 1, ratePer: 5000, concurrent: 1 });
const vancouver = 'https://www.zillow.com/homes/for_rent/?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22usersSearchTerm%22%3A%2297202%22%2C%22mapBounds%22%3A%7B%22west%22%3A-122.75167811040934%2C%22east%22%3A-122.34999048833903%2C%22south%22%3A45.58492397126381%2C%22north%22%3A45.77537807175674%7D%2C%22mapZoom%22%3A12%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22price%22%3A%7B%22max%22%3A538633%7D%2C%22fore%22%3A%7B%22value%22%3Afalse%7D%2C%22att%22%3A%7B%22value%22%3A%22garage%22%7D%2C%22mp%22%3A%7B%22max%22%3A2000%7D%2C%22ah%22%3A%7B%22value%22%3Atrue%7D%2C%22auc%22%3A%7B%22value%22%3Afalse%7D%2C%22nc%22%3A%7B%22value%22%3Afalse%7D%2C%22fr%22%3A%7B%22value%22%3Atrue%7D%2C%22fsbo%22%3A%7B%22value%22%3Afalse%7D%2C%22cmsn%22%3A%7B%22value%22%3Afalse%7D%2C%22fsba%22%3A%7B%22value%22%3Afalse%7D%7D%2C%22isListVisible%22%3Atrue%7D';
const sePortland = `https://www.zillow.com/homes/for_rent/?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22mapBounds%22%3A%7B%22west%22%3A-122.72600013214226%2C%22east%22%3A-122.5251563211071%2C%22south%22%3A45.43723154517647%2C%22north%22%3A45.5327902655983%7D%2C%22mapZoom%22%3A13%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22price%22%3A%7B%22min%22%3A0%2C%22max%22%3A538633%7D%2C%22fore%22%3A%7B%22value%22%3Afalse%7D%2C%22att%22%3A%7B%22value%22%3A%22garage%22%7D%2C%22mp%22%3A%7B%22min%22%3A0%2C%22max%22%3A2000%7D%2C%22ah%22%3A%7B%22value%22%3Atrue%7D%2C%22sort%22%3A%7B%22value%22%3A%22days%22%7D%2C%22auc%22%3A%7B%22value%22%3Afalse%7D%2C%22nc%22%3A%7B%22value%22%3Afalse%7D%2C%22fr%22%3A%7B%22value%22%3Atrue%7D%2C%22fsbo%22%3A%7B%22value%22%3Afalse%7D%2C%22cmsn%22%3A%7B%22value%22%3Afalse%7D%2C%22fsba%22%3A%7B%22value%22%3Afalse%7D%7D%2C%22isListVisible%22%3Atrue%7D`;
const nPortland = 'https://www.zillow.com/homes/for_rent/?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22usersSearchTerm%22%3A%2297202%22%2C%22mapBounds%22%3A%7B%22west%22%3A-122.76545665917283%2C%22east%22%3A-122.56461284813767%2C%22south%22%3A45.52480846355368%2C%22north%22%3A45.62021864249521%7D%2C%22mapZoom%22%3A13%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22price%22%3A%7B%22max%22%3A538633%7D%2C%22fore%22%3A%7B%22value%22%3Afalse%7D%2C%22att%22%3A%7B%22value%22%3A%22garage%22%7D%2C%22mp%22%3A%7B%22max%22%3A2000%7D%2C%22ah%22%3A%7B%22value%22%3Atrue%7D%2C%22auc%22%3A%7B%22value%22%3Afalse%7D%2C%22nc%22%3A%7B%22value%22%3Afalse%7D%2C%22fr%22%3A%7B%22value%22%3Atrue%7D%2C%22fsbo%22%3A%7B%22value%22%3Afalse%7D%2C%22cmsn%22%3A%7B%22value%22%3Afalse%7D%2C%22fsba%22%3A%7B%22value%22%3Afalse%7D%7D%2C%22isListVisible%22%3Atrue%7D';
const sPortland = 'https://www.zillow.com/homes/for_rent/?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22usersSearchTerm%22%3A%2297202%22%2C%22mapBounds%22%3A%7B%22west%22%3A-122.76472640751183%2C%22east%22%3A-122.56388259647667%2C%22south%22%3A45.40109966864462%2C%22north%22%3A45.496719608407645%7D%2C%22mapZoom%22%3A13%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22price%22%3A%7B%22max%22%3A538633%7D%2C%22fore%22%3A%7B%22value%22%3Afalse%7D%2C%22att%22%3A%7B%22value%22%3A%22garage%22%7D%2C%22mp%22%3A%7B%22max%22%3A2000%7D%2C%22ah%22%3A%7B%22value%22%3Atrue%7D%2C%22auc%22%3A%7B%22value%22%3Afalse%7D%2C%22nc%22%3A%7B%22value%22%3Afalse%7D%2C%22fr%22%3A%7B%22value%22%3Atrue%7D%2C%22fsbo%22%3A%7B%22value%22%3Afalse%7D%2C%22cmsn%22%3A%7B%22value%22%3Afalse%7D%2C%22fsba%22%3A%7B%22value%22%3Afalse%7D%7D%2C%22isListVisible%22%3Atrue%7D';

const scrapeLogic = async(currentIdsStored, searchLink) => {
  await request(searchLink)
    .set('origin', 'true')
    .set('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36')
    .use(throttle.plugin())
    .then(response => {
      if(response.statusCode == 200) {
        const html = response.text;
        const $ = cheerio.load(html);

        $('.list-card').each((i, element) => {
          const price = $(element)
            .find('.list-card-price')
            .text()
            .replace(/\D/g, '') || 0;

          const bed = $(element)
            .find('.list-card-details li:nth-child(1)')
            .text()
            .replace(/\D/g, '') || 0;
  
          const bath = $(element)
            .find('.list-card-details li:nth-child(2)')
            .text()
            .replace(/\D/g, '') || 0;

          const squareFeet = $(element)
            .find('.list-card-details li:nth-child(3)')
            .text()
            .replace(/\D/g, '') || 0;

          const address = $(element)
            .find('.list-card-addr')
            .text();

          const link = $(element)
            .find('a')
            .attr('href');

          const id = $(element)
            .attr('id')
            .replace(/\D/g, '');

          const listing = {
            id,
            source: 'Zillow',
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
          if(validListing(listing) && !duplicateEntry){
            console.log('written to db');
            Listing.insert(listing);
            sendMessage(constructMessage(listing));
          }
        });
      }
    });
};

const constructMessage = ({ address, link, price }) => {
  const messageBody = `
    ${address.substring(0, 20)},
    ${link},
    ${price}
  `;
  return messageBody;
}

const validListing = (listing) => {
  if(listing.link != null
    && listing.price != 0
    && listing.address != ''
    && listing.bed < 3){
    return true;
  }
  return false;
}

const run = async() => {
  const currentIdsStored = await Listing.getAllIds();
  console.log(currentIdsStored);
  console.log('Scraping Begins');

  if(okToScrape()){
    await scrapeLogic(currentIdsStored, vancouver);
    await setTimeout(() => { scrapeLogic(currentIdsStored, sePortland) }, 60000);
    await setTimeout(() => scrapeLogic(currentIdsStored, nPortland), 120000);
    await setTimeout(() => scrapeLogic(currentIdsStored, sPortland), 180000);
  }

  console.log('Scraping Complete');
};

run();
