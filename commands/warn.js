const discord = require("discord.js");
const commands = require(".");
const userUtil = require("../util/user");
const roleUtil = require("../util/role");
const config = require("../config.json");

const warningRadix = config.warningRadix;

/**
 * This command.
 */
const command = "warn";

/**
 * Handles the given command.
 * @param {discord.Message} msg The message.
 * @param {discord.Client} bot The bot.
 */
const handle = async (msg, bot) => {
  // Permission check
  if (!userUtil.hasPermission(msg.member)) {
    await msg.delete();
    return;
  }
  // Parse command.
  const suffix = msg.content.substr(commands.commandPrefix(command).length);
  const split = suffix.split(" ");
  let id = "";
  let reason = "";
  if (split.length >= 2) {
    id = split[0].trim();
    reason = split.slice(1).join(" ").trim();
  } else if (split.length === 1) {
    id = split[0].trim();
    reason = "Pure dark hate"; // TODO: Generate random reason.
  } else {
    await msg.reply(`😭 Whoops! The format does not look quite right. - Pro Tip: Use \`/warn @${msg.author.username} Your completely arbitrary reason here!\` to warn a user.`);
    return;
  }
  // Get discord user and server member.
  const user = bot.users.get(userUtil.parseUser(id));
  const member = user && msg.guild.members.get(user.id);
  if (!user || !member) {
    await msg.reply(`😭 Oh noes! I could not find the user "${id}". Sorry! - Pro Tip: Use \`/warn @${msg.author.username} Your completely arbitrary reason here!\` to warn a user.`);
    return;
  }
  // Set roles.
  let warnings = 0;
  try {
    const roles = roleUtil.warningRoles(member);
    warnings = roleUtil.highestWarningRole(roles) + 1;
    const newRole = await roleUtil.lazyCreateRole(member.guild, warnings);
    await member.addRole(newRole);
    await member.removeRoles(roles);
  } catch (e) {
    console.error("Failed to reassign roles", e);
    await msg.reply(`😭 I was unable to assign the updated roles! ${e.message}`);
    return;
  }
  // Send messages.
  try {    
    console.log("Warned", { username: user.username, by: msg.author.username, reason, warnings });
    await user.send(`👎 [${msg.guild.name}] You have been warned by <@${msg.author.id}> in channel "${msg.channel.name}". This is warning #${warnings.toString(warningRadix)}. (Reason: ${reason})`);
    await msg.channel.send(`👎 "${user.username}" has been warned by "${msg.author.username}". This is warning #${warnings.toString(warningRadix)}. (Reason: ${reason})`);
  } catch (e) {
    console.error("Failed to send message", e);
    await msg.reply(`😭 I was unable to send some messages! ${e.message}`);
    return;
  }
}

module.exports = { command, handle };
