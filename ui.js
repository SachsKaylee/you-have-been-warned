const auth = require("./auth");
const open = require("open");

const openBrowser = () => open(auth.url(auth.clientId, auth.permissions));

module.exports = { openBrowser };
