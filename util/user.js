const discord = require("discord.js");

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

module.exports = { parseUser };
