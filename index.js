const ui = require("./ui");
const auth = require("./auth");
const config = require("./config.json");
const discord = require("discord.js");
const commands = require("./commands");
const commandWarn = require("./commands/warn");
const commandWarnall = require("./commands/warnall");
const commandUnwarn = require("./commands/unwarn");
const commandPornImage = require("./commands/pornimage");

const bot = new discord.Client();

bot.on("ready", e => {
  console.log("Connected", { username: bot.user.username, id: bot.user.id });
});

bot.on('message', async msg => {
  try {
    if (msg.content.startsWith(commands.commandPrefix(commandWarnall.command))) {
      await commandWarnall.handle(msg, bot);
      return;
    }
    if (msg.content.startsWith(commands.commandPrefix(commandWarn.command))) {
      await commandWarn.handle(msg, bot);
      return;
    }
    if (msg.content.startsWith(commands.commandPrefix(commandUnwarn.command))) {
      await commandUnwarn.handle(msg, bot);
      return;
    }
    if(msg.content === config.command_prefix + commandPornImage.command || msg.content.startsWith(commands.commandPrefix(commandPornImage.command))){
      await commandPornImage.handle(msg,bot);
      return;
    }
    else{
      console.log(msg.content);
    }
  } catch (error) {
    console.error("Error while handling message", error);
  }
});

bot.login(auth.token);
ui.openBrowser();
