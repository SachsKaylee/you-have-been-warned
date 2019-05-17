const auth = require("./auth");
const config = require("./config.json");
const open = config.openBrowser && require("open");

const openBrowser = () => open && open(auth.url(auth.clientId, auth.permissions));

module.exports = { openBrowser };
