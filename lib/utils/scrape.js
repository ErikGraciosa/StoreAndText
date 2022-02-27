const Throttle = require('superagent-throttle');
const request = require('superagent');
const cheerio = require('cheerio');
const Listing = require('../models/Listing.js');
const { sendText } = require('../utils/sendText');

const timeStamp = new Date();
const throttle = new Throttle({ rate: 1, ratePer: 5000, concurrent: 1 });


const scrapeZillow = async() => {

  let page;
  let bed;
  
  for(bed = 0; bed <= 6; bed++){
    for(page = 1; page <= 10; page++){
      console.log(bed, page);
      await scrapeLogic(page, bed, bed);
    }
  }

  for(page = 1; page <= 10; page++){
    console.log(page);
    await scrapeLogic(page, 7, 20);
  }

};

const textNewResults = async() => {

  const db_timestamp = await Listing.latestTime();

  if(String(db_timestamp) === String(timeStamp)){
    
    const val = await Listing.getTextingList();

    if(val !== null){

      for(let i = 0; i < val.length; i++){

        const user = {
          phoneNumber: val[i].phoneNumber,
          carrier: val[i].carrier
        };
  
        const message = String(val[i].link);
  
        await sendText(user, message);
  
        console.log('Text Sent');

      }
    } else {
      console.log('No Texts Sent');
    }

  }

};

const scrapeLogic = async(page, minBed, maxBed) => {

  const searchLink = `https://www.zillow.com/portland-or/1-1_beds/2_p/?searchQueryState=%7B%22pagination%22%3A%7B%22currentPage%22%3A${page}%7D%2C%22mapBounds%22%3A%7B%22west%22%3A-124.30244448828125%2C%22east%22%3A-121.08894351171875%2C%22south%22%3A44.77891038746072%2C%22north%22%3A46.32132614063067%7D%2C%22regionSelection%22%3A%5B%7B%22regionId%22%3A13373%2C%22regionType%22%3A6%7D%5D%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22beds%22%3A%7B%22min%22%3A${minBed}%2C%22max%22%3A${maxBed}%7D%2C%22ah%22%3A%7B%22value%22%3Atrue%7D%2C%22sort%22%3A%7B%22value%22%3A%22globalrelevanceex%22%7D%2C%22land%22%3A%7B%22value%22%3Afalse%7D%7D%2C%22isListVisible%22%3Atrue%2C%22mapZoom%22%3A9%7D`;

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
          if(listing.address.includes('Portland')){
            console.log(listing);
            Listing.insert(listing);
          }
        });

      }
    }

    );
};

const run = async() => {

  console.log('Scraping Begins');

  await scrapeZillow();
  await textNewResults();

  console.log('Scraping Complete');

};

run();
