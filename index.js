const ui = require("./ui");
const auth = require("./auth");
const config = require("./config.json");
const discord = require("discord.js");

const bot = new discord.Client();

const warningPrefix = config.warningPrefix;
const warningRadix = config.warningRadix;

bot.on("ready", e => {
  console.log("Connected", { username: bot.user.username, id: bot.user.id });
});

bot.on('message', async msg => {
  if (msg.content.startsWith("/warn ")) {
    // Parse command.
    const command = msg.content.substr("/warn ".length);
    const split = command.split(" ");
    let id = "";
    let reason = "";
    if (split.length >= 2) {
      id = split[0].trim();
      reason = split.slice(1).join(" ").trim();
    } else if (split.length === 1) {
      id = split[0].trim();
      reason = "Pure dark hate"; // TODO: Generate random reason.
    } else {
      msg.reply(`😭 Whoops! The format does not look quite right. - Pro Tip: Use \`/warn @${msg.author.username} Your completely arbitrary reason here!\` to warn a user.`);
      return;
    }
    // Get discord user and server member.
    const user = parseUser(id);
    const member = user && msg.guild.members.get(user.id);
    if (!user || !member) {
      msg.reply(`😭 Oh noes! I could not find the user "${id}". Sorry! - Pro Tip: Use \`/warn @${msg.author.username} Your completely arbitrary reason here!\` to warn a user.`);
      return;
    }
    // Set roles.
    let warnings = 0;
    try {
      const roles = warningRoles(member);
      warnings = highestWarningRole(roles) + 1;
      const newRole = await lazyCreateRole(member.guild, warnings);
      await member.addRole(newRole);
      await member.removeRoles(roles);
    } catch (e) {
      console.error("Failed to reassign roles", e);
      msg.reply(`😭 This could have gone better! ${e.message}`);
      return;
    }
    // Send messages.
    try {
      await user.send(`👎 [${msg.guild.name}] You have been warned by <@${msg.author.id}> in channel "${msg.channel.name}" (Reason: ${reason}). This is warning #${warnings.toString(warningRadix)}`);
    } catch (e) {
      console.error("Failed to send message", e);
      msg.reply(`😭 This could have gone better! ${e.message}`);
      return;
    }
    console.log("Warned", { username: user.username, by: msg.author.username, reason, warnings });
    msg.channel.send(`👎 "${user.username}" has been warned by "${msg.author.username}" (Reason: ${reason}). This is warning #${warnings.toString(warningRadix)}`);
  }
});

/**
 * Creates the given role if it does not exist
 * @param {discord.Guild} guild The guild.
 * @param {number} warnings The amount of warnings.
 */
const lazyCreateRole = async (guild, warnings) => {
  const name = warningPrefix + warnings.toString(warningRadix);
  let role = guild.roles.get(name);
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

bot.login(auth.token);

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
  return bot.users.get(id);
}

ui.openBrowser();
