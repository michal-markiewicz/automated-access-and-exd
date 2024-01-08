import { log } from "./main.js";
import { typeCredentialsAndSubmit } from "./main.js";
import { accountIds, internalUserEmails, adminPanelAccount, environment } from "./settings.js";

const editUserButtonsSelector = `[data-qa-test-element="account-users--btn-edit"]`;
const themesPermissionsSwitchSelector = `[data-testid="themes-edit-switch"] input`;
const userEmailInputSelector = `#account-user-edit-dialog--email-input`;
const saveButtonSelector = `[data-testid="dialog-confirm-button"]`;
const cancelButtonSelector = `[data-testid="dialog-cancel-button"]`;

const rowsPerPageInputSelector = `[class*='Pagination'] > input`;
const maximumRowsSelector = `li[data-value='50']`;

async function giveExdPermissionsForAllAccounts(page, browser, index = 1) {
  await goToAccountWithSso(page, accountIds[index - 1]);
  await page.goto(`https://${environment}.zoovu.com/users`);
  await giveExdPermissionsToUsers(page);

  if (index < accountIds.length) {
    index++;
    await giveExdPermissionsForAllAccounts(page, browser, index);
  }
}

async function giveExdPermissionsToUsers(page) {
  await page.waitForSelector(rowsPerPageInputSelector);
  await page.click(rowsPerPageInputSelector);
  await page.waitForSelector(maximumRowsSelector);
  await page.click(maximumRowsSelector);

  await page.waitForSelector(editUserButtonsSelector);
  const editUserButtons = await page.$$(editUserButtonsSelector);

  for (const editUserButton of editUserButtons) {
    await editUserButton.click();
    await page.waitForSelector(themesPermissionsSwitchSelector);
    await page.waitForSelector(userEmailInputSelector);
    const userEmailInput = await page.$(userEmailInputSelector);
    const userEmail = await userEmailInput.evaluate((node) => node.value);
    let userShouldHaveExdPermissions = false;

    for (let i = 0; i < internalUserEmails.length + 1; i++) {
      if (userEmail === internalUserEmails[i] || userEmail === adminPanelAccount.email) {
        userShouldHaveExdPermissions = true;
      }
    }

    const checkedSwitchSelector = `.Mui-checked[data-qa-test-element="switch-toggle-Edit: Themes in Experience Designer"]`;
    const checkedSwitch = await page.$(checkedSwitchSelector);

    if (userShouldHaveExdPermissions && !checkedSwitch) {
      log(`Giving EXD permissions to ${userEmail}.`);

      await page.click(themesPermissionsSwitchSelector);
      await page.click(saveButtonSelector);
    } else {
      if (userShouldHaveExdPermissions && checkedSwitch) {
        log(`EXD permissions were already granted to ${userEmail}`);
      }
      await page.click(cancelButtonSelector);
    }

    const dialogSelector = "div .MuiDialog-container";
    await page.waitForSelector(dialogSelector, { hidden: true });
  }
}

async function goToAccountWithSso(page, accountId) {
  page.goto(
    `https://login.zoovu.com/zoovub2cprod.onmicrosoft.com/b2c_1a_jwt_signin/oauth2/v2.0/logout?post_logout_redirect_uri=https%3A%2F%2F${environment}-backend-api.zoovu.com%2Fusers%2Fjwt-login%3Fredirect_uri%3Dhttps%3A%2F%2F${environment}.zoovu.com%2F%26account_id%3D${accountId}`
  );
  await typeCredentialsAndSubmit(page);
}

export { giveExdPermissionsForAllAccounts, giveExdPermissionsToUsers };
