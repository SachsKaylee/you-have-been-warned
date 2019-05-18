const config = require("./config.json");

/**
 * The client ID of the bot.
 */
const clientId = config.id;

/**
 * The permission bitmask of the bot.
 */
const permissions = parseInt(config.permissions, 10);

/**
 * The spooky scary secret.
 */
const token = config.token;

/**
 * 
 * @param {string} clientId The client ID.
 * @param {number} permissions The permission bit mask.
 */
const url = (clientId, permissions) => `https://discordapp.com/oauth2/authorize?&client_id=${clientId}&scope=bot&permissions=${permissions}`;

module.exports = { clientId, permissions, token, url };
