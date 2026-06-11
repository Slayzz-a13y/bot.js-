const { PermissionFlagsBits } = require('discord.js')
module.exports = {
    name: "ban",
    description: "Bannir un membre du serveur",
    permissions: PermissionFlagsBits.BanMembers,
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à bannir",
            required: true
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du bannissement",
            required: false
        }
    ],
    async run(bot, interaction, args) {
        await interaction.deferReply()

        try {
            let user = args.getUser("membre")
            if (!user) return interaction.editReply("Pas de membre à bannir !")

            let member = interaction.guild.members.cache.get(user.id)

            let reason = args.getString("raison")
            if (!reason) reason = "Aucune raison fournie"

            if (interaction.user.id === user.id)
                return interaction.editReply("Vous ne pouvez pas vous bannir vous même !")

            if ((await interaction.guild.fetchOwner()).id === user.id)
                return interaction.editReply("Ne ban pas le propriétaire du serveur !")

            if (member && !member?.bannable)
                return interaction.editReply("Je ne peux pas bannir ce membre !")

            if (member && interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0)
                return interaction.editReply("Vous ne pouvez pas bannir ce membre !")

            if ((await interaction.guild.bans.fetch()).get(user.id))
                return interaction.editReply("Ce membre est déjà banni !")

            await interaction.guild.members.ban(user.id, { reason: reason })

            // Sauvegarde en DB
            await bot.db.query(
                `INSERT INTO moderation (user_id, guild_id, action, reason, moderator_id) VALUES ($1, $2, $3, $4, $5)`,
                [user.id, interaction.guild.id, 'ban', reason, interaction.user.id]
            )

            try { 
                await user.send(`Vous avez été banni du serveur **${interaction.guild.name}** pour la raison : ${reason}`) 
            } catch (err) {}

            await interaction.editReply(`✅ ${interaction.user} a banni ${user.tag} pour la raison : ${reason}`)

        } catch (err) {
            console.error(err)
            return interaction.editReply("Une erreur est survenue !")
        }
    }
}