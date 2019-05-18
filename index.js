const ui = require("./ui");
const auth = require("./auth");
const config = require("./config.json");
const discord = require("discord.js");
const commands = require("./commands");
const commandWarn = require("./commands/warn");

const bot = new discord.Client();

bot.on("ready", e => {
  console.log("Connected", { username: bot.user.username, id: bot.user.id });
});

bot.on('message', async msg => {
  try {
    if (msg.content.startsWith(commands.commandPrefix(commandWarn.command))) {
      await commandWarn.handle(msg, bot);
    }
  } catch (error) {
    console.error("Error while handling message", error);
  }
});

bot.login(auth.token);
ui.openBrowser();
