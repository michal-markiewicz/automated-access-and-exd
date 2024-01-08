import "dotenv/config";

// you gonna get admin access to each account
const adminPanelAccount = {
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
};

// no need to put your email here, program is gonna take it from adminPanelAccount object
// so just put each email that should be assigned to each account and should get EXD permissions
const userEmails = ["oleksii.shanovskyi@zoovu.com"];

// users gonna get assigned to each account added here
const accountIds = ["250000035", "250000334"];

// if you change environment make sure to change email aswell
const environment = "orca"; // orca or barracuda

export { adminPanelAccount, userEmails as internalUserEmails, accountIds, environment };
