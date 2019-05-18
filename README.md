# you-have-been-warned 👎

A bot that manages user warnings. Use it to enforce roles on your channel or ~~to annoy your friends~~ *other serious stuff*.

<img src="https://patrick-sachs.dev/api/files/serve/screenshot-from-2019-05-18-14-17-49-png-png-dbdf">

## Why?

This project was born out of a joke among friends for giving each other warnings on Discord for the most ridiculous of things.

At some point manually remember each warning and managing it in discord became way too cumersome and we decided to automate this process.

Even though born out of a joke this bot is also suited for practical use.

## Commands

* `/warn @Who Your reason here!` - Issues a warning to the given user. The reason is optional. The user will also be notificed personally about their most evil transgression.
* `/unwarn @Who Your reason here!` - Revokes a warning from the given user. If you are feeling generous you can also inform the user why a warning was revoked. The user will also be notified personally.

## Get the bot on your server

[Click, click, done](https://discordapp.com/oauth2/authorize?&client_id=579045890346713108&scope=bot&permissions=8) - Bot hosting provided by [sahnee.de](https://sahnee.de)

You're done, enjoy! (**Keep in mind that when using the public bot only admins & users that can kick/ban/manage roles can issue warnings**)

Want to host the bot on your own server or join in on developing? Then keep reading!

## How to install on your own hardware

Copy `config.json.tpl` to `config.json`. Let's go through the settings.

| Setting | Description |
| --- | --- |
| `id` | The client ID of the bot. The client I am hosting publically is `"579045890346713108"`, if you want to run your own insert your ID here. |
| `permissions` | The permissions of this bot. By default the bot has permission `8` which makes it an administrator. (This is subject to change in a later version) |
| `token` | Your super secret bot token. See below on how to generate one. |
| `openBrowser` | If you are running on a GUI based OS(how fancy!) and this setting is `true` a browser window with further instructions will open upon starting the bot. Set to `false` to disable. |
| `warningPrefix` | Users will be given a role based on their warning count. If this value is e.g. set to `"warnings: "` the role of 4 warnings will be named "warnings: 4". |
| `warningRadix` | Only change this if you want your bot to be super nerdy. E.g. setting this to `16` will make your warning count be displayed in hexadecimal, or `2` for binary. `10` is the sane setting. |
| `admin` | If order to issue warnings a user must have at least one of these permissions. |

How to get a token & client ID? [https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)

If case you get lost, this is the default config:

```json
{
  "id": "579045890346713108",
  "permissions": 8,
  "token": "- YOUR TOKEN HERE -",
  "openBrowser": true,
  "warningPrefix": "warnings: ",
  "warningRadix": 10,
  "admins": [
    "ADMINISTRATOR",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "MANAGE_ROLES",
    "MANAGE_ROLES_OR_PERMISSIONS"
  ]
}
```

2. Open a terminal and enter `npm i` followed by `npm run start`. A browser window with further instructions will now open.