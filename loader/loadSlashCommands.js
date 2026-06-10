const discord = require("discord.js")
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord.js')

module.exports = async bot => {
    let commands = []
    bot.commands.forEach(command => {
        let slashCommand = new discord.SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)
        .setDMPermission(command.dm)
        .setDefaultMemberPermissions(command.permissions === "Aucune" ? null : command.permissions)
        if(command.options?.length >= 1) {
            for(let i = 0; i < command.options.length; i++) {
                slashCommand[`add${command.options[i].type.slice(0, 1).toUpperCase() + command.options[i].type.slice(1)}Option`](option => option.setName(command.options[i].name).setDescription(command.options[i].description).setRequired(command.options[i].required))
            }
        }
        commands.push(slashCommand)
    })
    const rest = new REST({version: "10"}).setToken(bot.token)
    await rest.put(Routes.applicationCommands(bot.user.id), { body: commands })
    console.log("les slash commandes sont créées avec succès !")
}