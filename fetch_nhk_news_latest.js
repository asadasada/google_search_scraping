/** *
 * NHKニュースの最新の記事と短い記事の概要をgoogleサーチエンジンから取得するスクリプト
 * screenshotの代わりに記事一覧のhtmlを取得
*/

const puppeteer = require("puppeteer");
const fs = require("fs");
//instead ES module system
//use query selecter instead waitfor secs or selecter navigate
(async () => {
  const searchQuery = "nhknews";
  const browser = await puppeteer.launch();
  const [page] = await browser.pages();
  let article = { title: "", content: "" };
  
  //4_10
  await page.goto("https://www.google.com/");
  //aria-label="検索"
  //aria-label doesn't much though
  await page.waitForSelector('textarea[title="検索"]', { visible: true });
  await page.type('textarea[title="検索"]', "nhknews");

  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
  page.keyboard.press("Enter"),
  ]);
  let el = await page.evaluateHandle(() => [...document.querySelectorAll('div')].find(el => el.textContent == "ニュース"));
  await el.click();

  await page.waitForNavigation({ waitUntil: "domcontentloaded" });

  jsHandle_title = await page.evaluateHandle(() => {
    return document.querySelectorAll('#search > div > div > div > div > div > div a > div > div:nth-of-type(2) div[aria-level="3"]');
  });
  jsHandle_content = await page.evaluateHandle(() => {
    return document.querySelectorAll('#search > div > div > div > div > div > div a > div > div:nth-of-type(3)');
  });

  article.title = await page.evaluate(els => els[0].innerHTML, jsHandle_title);
  article.content = await page.evaluate(el => el.innerHTML, jsHandle_content);
  console.log(article);
  try {
    await page.content().then((res) => {
      fs.writeFileSync("./dist.html", res);
      // article.title + article.content ? console.log(article.title+" "+article.content):"";
    });
    console.log("wrote html to file");
} catch (error) {
    console.log(error);        
}
  console.log("end script");
  if (browser)
    browser.close();
  //finaly
  if(browser)
  browser.close();
})();
