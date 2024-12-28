const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');
const { stringify } = require('csv-stringify');

(async function() {
    let tweetUrls = [];
    const result = [];

    fs.createReadStream('datasets/test.csv')
        .pipe(csv())
        .on('data', (row) => {
            tweetUrls.push(row.tweet_url);
        })
        .on('end', async () => {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            for (let url of tweetUrls) {
                console.log('----------------------------------------------------------');
                console.log('Url:', url);
                try {
                    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
                    await page.goto(url, { waitUntil: 'networkidle0' });

                    await page.waitForSelector('div[lang="in"]');

                    const tweetText = await page.$eval('div[lang="in"]', (element) => {
                        return element.innerText;
                    });
                    result.push({ tweet_url: url, tweet_text: tweetText });
                    console.log('Text:', tweetText);
                } catch (error) {
                    console.error('Error processing URL:', url, error);
                    result.push({ tweet_url: url, tweet_text: 'Error processing tweet' });
                }
            }

            await browser.close();

            const outputPath = 'datasets/output.csv';
            const fileExists = fs.existsSync(outputPath);

            const outputStream = fs.createWriteStream(outputPath, { flags: 'a' });

            if (!fileExists) {
                stringify([{
                    tweet_url: 'tweet_url',
                    tweet_text: 'tweet_text'
                }], { header: false, columns: ['tweet_url', 'tweet_text'] }, (err, headerOutput) => {
                    if (err) {
                        console.error('Error creating header:', err);
                    } else {
                        outputStream.write(headerOutput);
                    }
                });
            }

            stringify(result, { header: false, columns: ['tweet_url', 'tweet_text'] }, (err, output) => {
                if (err) {
                    console.error('Error creating CSV:', err);
                } else {
                    outputStream.write(output);
                    console.log(`CSV data appended to ${outputPath}`);
                }
            });
        });
})();
