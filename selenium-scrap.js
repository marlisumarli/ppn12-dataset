const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const csv = require('csv-parser');
const fs = require('fs');


const userDataDir = '/Users/marlisumarli/Library/Application Support/Google/Chrome';
const profileDir = 'Default';

const options = new chrome.Options();

options.addArguments(`--user-data-dir=${userDataDir}`);
options.addArguments(`--profile-directory=${profileDir}`);

// (async function openChromeProfile() {
//     let driver = await new Builder()
//         .forBrowser('chrome')
//         .setChromeOptions(options)
//         .build();
//
//         await driver.get('https://www.google.com');
//         await driver.sleep(10000)
// })();

(async function() {
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    let tweetUrls = [];
    fs.createReadStream('datasets/test.csv')
        .pipe(csv())
        .on('data', (row) => {
            tweetUrls.push(row.tweet_url);
        })
        .on('end', async () => {
            for (let url of tweetUrls) {
                try {
                    await driver.executeScript('window.open(arguments[0], "_blank");', url);
                    await driver.sleep(2000);

                    let handles = await driver.getAllWindowHandles();
                    await driver.switchTo().window(handles[handles.length - 1]);

                    let tweetElement = await driver.findElement(By.css('div[data-testid="tweetText"]'));
                    let tweetText = await tweetElement.getText();

                    console.log('Tweet Text:', tweetText);

                    await driver.close();

                    await driver.switchTo().window(handles[0]);

                    await driver.sleep(1000);

                } catch (error) {
                    console.error('Error processing URL:', url, error);
                }
            }

            // await driver.quit();
        });
})();
