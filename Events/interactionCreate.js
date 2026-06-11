const discord = require("discord.js")
module.exports = {
    name: "interactionCreate",
    async run(bot, interaction) {
        
        if(interaction.isChatInputCommand()) {
            let command = bot.commands.get(interaction.commandName)
            if(!command) return interaction.reply("Cette commande n'existe pas !")
            command.run(bot, interaction, interaction.options)
        }

        // ✅ Autocomplétion pour setcaptcha
        if(interaction.isAutocomplete()) {
            if(interaction.commandName === "setcaptcha") {
                let choice = ["on", "off"]
                // ❌ entry → ✅ interaction.options.getFocused()
                let entry = interaction.options.getFocused()
                let sortie = choice.filter(c => c.includes(entry))
                await interaction.respond(sortie.map(c => ({ name: c, value: c })))
            }
        }
    }
}