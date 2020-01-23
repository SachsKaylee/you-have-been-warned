const discord = require("discord.js");
const config = require("../config.json");

/**
 * The permissions for controlling the bot.
 * @type {string[]}
 */
const permissionsWarnBot = config.admins;

/**
 * The permissions for posting porn images.
 * @type {string[]}
 */
const permissionsPornImageBot = config.pornImageGroups;


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
const hasPermission = member => permissionsWarnBot.some(p => member.hasPermission(p));

/**
 * Checks if the guild member has the permission to send some porn images.
 * @param {discord.GuildMember} member The guild member.
 */
const hasPermissionPornImages = member => permissionsPornImageBot.some(p => member.hasPermission(p));

module.exports = { parseUser, hasPermission, hasPermissionPornImages };
