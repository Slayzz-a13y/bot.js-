const { PermissionFlagsBits } = require('discord.js')
module.exports = {
    name: "unban",
    description: "Débannir un membre du serveur",
    permissions: PermissionFlagsBits.BanMembers,
    dm: false, 
    options: [
        {
            type: "user",
            name: "membre", 
            description: "Le membre à débannir",
            required: true
        }, {
            type: "string",
            name: "raison",
            description: "La raison du débannissement",
            required: false
        }
    ],
    async run(bot, interaction, args){
        try {
            let user = args.getUser("membre")
            if(!user) return interaction.reply("Pas de membre à unban !")
            let reason = args.getString("raison")
            if(!reason) reason = "Aucune raison fournie"
            if(!(await interaction.guild.bans.fetch()).get(user.id)) return interaction.reply("Ce membre n'est pas banni !")
            try { await user.send(`Vous avez été débanni du serveur ${interaction.guild.name} pour la raison : ${reason}`) } catch (err) {}
            await interaction.reply(`${interaction.user} a unban ${user.tag} pour la raison : ${reason}`)
            await interaction.guild.members.unban(user, reason)
        } catch (err) {
            console.error(err)
            return interaction.reply("Une erreur est survenue !")
        }
    }
}