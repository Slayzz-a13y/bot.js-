const Discord = require("discord.js")
module.exports = {
    name: "unmute", 
    description: "Unmute un membre du serveur",
    permissions: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    options: [
        {
            type: "user",
            name: "membre", 
            description: "Le membre à unmute",
            required: true
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du unmute",
            required: false
        }
    ],
    async run(bot, interaction, args){
        try {
            let user = args.getUser("membre")
            if(!user) return interaction.reply("Veuillez mentionner un membre à unmute")
            let member = interaction.guild.members.cache.get(user.id)
            if(!member) return interaction.reply("Ce membre n'est pas dans le serveur")
            let reason = args.getString("raison")
            if(!reason) reason = "Aucune raison fournie"
            if(!member.moderatable) return interaction.reply("Je ne peux pas unmute ce membre")
            if(interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return interaction.reply("Vous ne pouvez pas unmute ce membre")
            if(!member.isCommunicationDisabled()) return interaction.reply("Ce membre n'est pas mute")

            await member.timeout(null, reason)

            // Sauvegarde en DB
            await bot.db.query(
                `INSERT INTO moderation (user_id, guild_id, action, reason, moderator_id) VALUES ($1, $2, $3, $4, $5)`,
                [user.id, interaction.guild.id, 'unmute', reason, interaction.user.id]
            )

            try { 
                await user.send(`Vous avez été unmute du serveur **${interaction.guild.name}** pour la raison : ${reason}`) 
            } catch (err) {}

            await interaction.reply(`✅ ${interaction.user} a unmute ${user.tag} pour la raison : ${reason}`)

        } catch(err) {
            console.error(err)
            return interaction.reply("Une erreur est survenue !")
        }
    }
}