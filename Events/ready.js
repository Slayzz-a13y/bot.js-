const discord = require("discord.js")
const loadSlashCommands = require("../loader/loadSlashCommands") 
module.exports = {
    name: "ready",
    once: true,
    async run(bot) {
        await loadSlashCommands(bot)
        console.log(`${bot.user.tag} est connecté !`)
    }
}