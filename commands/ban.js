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
            let user = await bot.users.fetch(args.get("membre").value)
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

            try { await user.send(`Vous avez été banni du serveur ${interaction.guild.name} pour la raison : ${reason}`) } catch (err) {}

            await interaction.guild.members.ban(user.id, { reason: reason })
            bot.db.prepare(`
            INSERT INTO moderation (user_id, guild_id, action, reason, moderator_id)
            VALUES (?, ?, ?, ?, ?)
            `).run(user.id, interaction.guild.id, 'ban', reason, interaction.user.id)
            await interaction.editReply(`${interaction.user} a banni ${user.tag} pour la raison : ${reason}`)

        } catch (err) {
            console.error(err)
            return interaction.editReply("Une erreur est survenue !")
        }
    }
}