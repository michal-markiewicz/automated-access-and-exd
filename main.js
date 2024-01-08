// TODO: Handle cases where accounts have more than 50 users assigned to account

import dayjs from "dayjs";
import puppeteer from "puppeteer";
import { linkUsersForAllAccounts } from "./linkUsers.js";
import { giveExdPermissionsForAllAccounts } from "./exdPermissions.js";
import { accountIds, internalUserEmails, adminPanelAccount } from "./settings.js";

const emailInputSelector = "#signInName";
const passswordInputSelector = "#password";

(async () => {
  const { page, browser } = await launchBrowser();
  await page.goto("https://orca-admin.zoovu.com/");
  await typeCredentialsAndSubmit(page);
  await linkUsersForAllAccounts(page, accountIds);
  await giveExdPermissionsForAllAccounts(page, browser);
  await browser.close();
})();

async function launchBrowser() {
  const browser = await puppeteer.launch({ headless: "new", slowMo: 25 });
  const page = await browser.newPage();
  page.setDefaultTimeout(0);
  await page.setViewport({ width: 1080, height: 1024 });
  return {
    page,
    browser,
  };
}

async function typeCredentialsAndSubmit(page) {
  await page.waitForSelector(emailInputSelector);
  await page.waitForSelector(passswordInputSelector);

  log(`Logging into ${adminPanelAccount.email} account.`);
  await page.type(emailInputSelector, adminPanelAccount.email);
  await page.type(passswordInputSelector, adminPanelAccount.password);
  await page.click("#next");
  await page.waitForNavigation();
}

function log(message) {
  const currentTime = dayjs().format("HH:mm:ss");
  console.log(`[${currentTime}] ${message}`);
}

export { log, typeCredentialsAndSubmit };
