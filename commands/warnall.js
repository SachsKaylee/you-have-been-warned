const discord = require("discord.js");
const commands = require(".");
const userUtil = require("../util/user");
const roleUtil = require("../util/role");
const config = require("../config.json");

const warningRadix = config.warningRadix;

/**
 * This command.
 */
const command = "warnall";

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
  const reason = suffix ? suffix : "No reason provided."; // TODO: Generate random reason.
  // Get discord user and server member.
  const members = msg.guild.members;
  for (const [_id, member] of members) {
    const user = member.user;
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
    console.log("Warned", { username: user.username, by: msg.author.username, reason, warnings });
    // Send messages.
    try {
      await user.send(`👎 [${msg.guild.name}] You have been warned by <@${msg.author.id}> in channel "${msg.channel.name}". This is warning #${warnings.toString(warningRadix)}. (Reason: ${reason})`);
    } catch (e) {
      console.error("Failed to send message", e);
      await msg.reply(`😭 I was unable to send a private message to <@${user.id}>! ${e.message}`);
    }
    await msg.channel.send(`👎 "${user.username}" has been warned by "${msg.author.username}". This is warning #${warnings.toString(warningRadix)}. (Reason: ${reason})`);
  }
  await msg.channel.send(`😵 Issued warnings to ${members.size} users.`);
   
}

module.exports = { command, handle };
