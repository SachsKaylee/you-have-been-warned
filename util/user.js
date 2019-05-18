const discord = require("discord.js");
const config = require("../config.json");

/**
 * The permissions for controlling the bot.
 * @type {string[]}
 */
const permissions = config.admins;

/**
 * Parses a user id.
 * @param {string} id The ID, like `<@579045890346713108>`
 */
const parseUser = (id) => {
  if (id.startsWith("<@!")) {
    id = id.substring(3, id.length - 1);
  } else if (id.startsWith("<@")) {
    id = id.substring(2, id.length - 1);
  }
  return id;
}

/**
 * Checks if the guild member has the permission to control the bot.
 * @param {discord.GuildMember} member The guild member.
 */
const hasPermission = member => permissions.some(p => member.hasPermission(p));

module.exports = { parseUser, hasPermission };
