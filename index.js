const express = require('express');
const app = express();
const { scrape } = require('./scrapeBox');

app.get('/', async function (req, res) {
  try {
    const scrapeData = await scrape();
    res.status(200).json(scrapeData);
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, msg: 'Data not found' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on PORT 3000');
});
