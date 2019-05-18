const discord = require("discord.js");
const config = require("../config.json");

const warningPrefix = config.warningPrefix;
const warningRadix = config.warningRadix;

/**
 * Finds all roles of the given user.
 * @param {discord.GuildMember} member The guild member.
 */
const warningRoles = member => member.roles.filter(r => r.name.startsWith(warningPrefix)).array();

/**
 * Finds the role with the highest warning number.
 * @param {discord.Role[]} roles 
 */
const highestWarningRole = roles => {
  let warning = 0;
  for (let i = 0; i < roles.length; i++) {
    const role = roles[i];
    const str = role.name.substr(warningPrefix.length).trim();
    const num = parseInt(str, warningRadix);
    if (num > warning) {
      warning = num;
    }
  }
  return warning;
}

/**
 * Creates the given role if it does not exist
 * @param {discord.Guild} guild The guild.
 * @param {number} warnings The amount of warnings.
 */
const lazyCreateRole = async (guild, warnings) => {
  const name = warningPrefix + warnings.toString(warningRadix);
  let role = guild.roles.find("name", name);
  if (!role) {
    role = await guild.createRole({
      name: name,
      color: "GREY",
      mentionable: true,
      position: 1000 + warnings
    });
  }
  return role;
}

module.exports = { warningRoles, highestWarningRole, lazyCreateRole };
