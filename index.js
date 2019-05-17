const ui = require("./ui");
const auth = require("./auth");
const discord = require("discord.js");

const bot = new discord.Client();

bot.on("ready", e => {
  console.log("Connected", { username: bot.user.username, id: bot.user.id });
});

bot.on('message', msg => {
  if (msg.content.startsWith("/warn ")) {
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
      msg.reply(`😭 Whoops! The "${id}". Sorry!`);
      return;
    }
    const user = parseUser(id);
    if (!user) {
      msg.reply(`😭 Oh noes! I could not find the user "${id}". Sorry! Pro Tip: Use \`/warn @${msg.author.username} Your completely arbitrary reason here!\` to refer to a user.`);
      return;
    }
    console.log("Warned", { username: user.username, by: msg.author.username, reason });
    msg.channel.send(`👎 "${user.username}" has been warned by "${msg.author.username}" (Reason: ${reason}).`)
    user.send(`👎 [${msg.guild.name}] You have been warned by <@${msg.author.id}> in channel "${msg.channel.name}" (Reason: ${reason}).`);
  }
});

bot.login(auth.token);

/**
 * Parses a user id.
 * @param {string} id The ID, like `<@579045890346713108>`
 */
const parseUser = (id) => bot.users.get((id.startsWith("<@") && id.endsWith(">"))
  ? id.substring(2, id.length - 1)
  : id);

//ui.openBrowser();
//ui.eventLoop();
