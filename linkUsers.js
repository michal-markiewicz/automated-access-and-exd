import { log } from "./main.js";
import { accountIds, internalUserEmails, adminPanelAccount } from "./settings.js";

const linkUserButtonSelector = "[data-qa-test-element='admintool--btn-link-user']";
const userSearchSelector = "[data-qa-test-element='async-search-select'] input";
const accountAdminSwitch = "[data-qa-test-element='switch-toggle-Account Admin'] input";
const saveButtonSelector = "[data-qa-test-element='admintool--btn-save-new-user']";

async function linkUser(page, email, accountId, admin) {
  log(`Assigning ${email} to account ${accountId}.`);
  await page.waitForSelector(linkUserButtonSelector);
  await page.click(linkUserButtonSelector);

  await page.waitForSelector(userSearchSelector);
  await page.type(userSearchSelector, email);
  await page.waitForTimeout(3000);
  await page.keyboard.press("Enter");

  if (admin) {
    await page.waitForSelector(accountAdminSwitch);
    await page.click(accountAdminSwitch);
  }

  await page.waitForSelector(saveButtonSelector);
  await page.click(saveButtonSelector);

  await page.waitForSelector(saveButtonSelector, { hidden: true });
}

async function linkUsersForAllAccounts(page, accountIds) {
  for (const accountId of accountIds) {
    await page.goto(`https://orca-admin.zoovu.com/accounts/${accountId}`);

    for (const internalUserEmail of internalUserEmails) {
      await linkUser(page, internalUserEmail, accountId, false);
    }

    await linkUser(page, adminPanelAccount.email, accountId, true);
  }
}

export { linkUser, linkUsersForAllAccounts };
