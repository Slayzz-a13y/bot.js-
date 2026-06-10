const discord = require("discord.js")
module.exports = {
    name: "interactionCreate",
    async run(bot, interaction) {
        if(interaction.isChatInputCommand()) {
            let command = bot.commands.get(interaction.commandName)
            if(!command) return interaction.reply("Cette commande n'existe pas !")
            command.run(bot, interaction, interaction.options)
        }
    }
}