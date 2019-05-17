const ui = require("./ui");
const auth = require("./auth");
const discord = require("discord.js");

const bot = new discord.Client();

bot.on("any", (...a) => {
  console.log("event", ...a)
})

bot.on("ready", e => {
  console.log("Connected", { username: bot.user.username, id: bot.user.id });
});

bot.on('message', msg => {
  if (msg.content.startsWith("/warn ")) {
    const id = msg.content.substr("/warn ".length).trim();
    const user = parseUser(id);
    if (!user) {
      msg.reply(`😭 I could not find the user "${id}". Sorry!`);
      return;
    }
    msg.channel.sendMessage(`👎 "${user.username}" has been warned by "${msg.author.username}" - The banhammer is near.`)
    user.sendMessage("👎 YOU HAVE BEEN WARNED BY " + msg.author.username.toUpperCase());
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

ui.openBrowser();
//ui.eventLoop();
