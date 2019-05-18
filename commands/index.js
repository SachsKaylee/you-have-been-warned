/**
 * Gets the command prefix of the given command. This prefix must stand at the start of a message to be counted as this command.
 * @param {string} command The command name.
 */
const commandPrefix = command => `/${command} `;

module.exports = { commandPrefix };
