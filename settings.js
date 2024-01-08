import "dotenv/config";

const adminPanelAccount = {
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
};

// no need to put your email here, program is gonna take it from adminPanelAccount object
// so just put each email that should be assigned to each account and should get EXD permissions
const userEmails = [];

// users gonna get assigned to each account added here
const accountIds = ["250000334", "250000335"];

export { adminPanelAccount, userEmails as internalUserEmails, accountIds };
