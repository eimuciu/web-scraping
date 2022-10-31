const playwright = require('playwright');
const cheerio = require('cheerio');
const { hotelData } = require('./hotelData');

const url = 'https://www.agoda.com/';

const scrape = async () => {
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url);
  // const closeAdBtn = 'button[aria-label="Close Message"]';
  // await page.waitForSelector(closeAdBtn);
  // await page.locator(closeAdBtn).click();
  await page.getByRole('textbox').fill(hotelData.hotel_name);
  await page.locator('ul.AutocompleteList li').first().click();
  await page
    .getByRole('gridcell', {
      name: new RegExp(new Date(hotelData.check_in).toDateString(), 'i'),
    })
    .click();
  await page
    .getByRole('gridcell', {
      name: new RegExp(new Date(hotelData.check_out).toDateString(), 'i'),
    })
    .click();
  await page.getByRole('button', { name: /search/i }).click();
  await page.waitForSelector('.hotel-list-container');
  const pageContent = await page.content();
  const $ = cheerio.load(pageContent);
  const hotelHref = $('li[data-selenium="hotel-item"] a').toArray()[0].attribs
    .href;
  const fullLink = 'https://www.agoda.com' + hotelHref;
  await page.goto(fullLink);
  const bookBtn = '.ChildRoomsList-bookButtonInput';
  await page.locator(bookBtn).first().click();
  const finalPriceSelector =
    '#SiteContent > div > div.Itemstyled__Item-sc-12uga7p-0.qvXWa > section.Section__section--ir9K7.Section__white--23suH.PriceSection__section--20Hy-.Section__noPadding--2Glxz > div.sc-pZOBi.biiCJu > div > div.TotalPrice__totalPriceMoneyDisplay--2diU5 > div';
  const finalPrice = await page.locator(finalPriceSelector).innerHTML();
  await browser.close();
  return { fullLink, finalPrice };
};

module.exports = { scrape };
