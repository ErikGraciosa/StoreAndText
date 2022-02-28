const scrapeStartTime = process.env.SCRAPE_START_TIME;
const scrapeEndTime = process.env.SCRAPE_END_TIME;
const randomNumberPool = process.env.RANDOM_NUMBER_POOL;
const godSwitch = process.env.GOD_SWITCH;
const numberGuess = 5;

const okToScrape = () => {
    const currentHour = new Date().getHours();
    const randomizer = Math.ceil((Math.random() * randomNumberPool));
    console.log('hour' + currentHour);
    console.log('random number' + randomizer);



    if(godSwitch
        && !(currentHour < scrapeStartTime && currentHour > scrapeEndTime)
        && randomizer != numberGuess)
    {
        return true;
    }
    return false;
}

module.exports = {
    okToScrape
  };