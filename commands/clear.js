const Discord = require("discord.js")
module.exports = {
    name: "clear",
    description: "Supprimer des messages dans un salon",
    permissions: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    options: [
        {
            type: "number", 
            name: "nombre", 
            description: "Le nombre de messages à supprimer (max 300)",
            required: true
        }
    ],
    async run(bot, interaction, args){
        try {
            let nombre = args.getNumber("nombre")
            if(!nombre) return interaction.reply("Veuillez indiquer un nombre de messages à supprimer !")
            if(nombre > 300) return interaction.reply("Vous ne pouvez pas supprimer plus de 300 messages !")
            if(nombre < 1) return interaction.reply("Vous devez supprimer au moins 1 message !")
            await interaction.channel.bulkDelete(nombre, true)
            await interaction.reply(`${nombre} messages ont été supprimés !`)
        } catch(err) {
            console.error(err)
            return interaction.reply("Une erreur est survenue !")
        }
    }
}