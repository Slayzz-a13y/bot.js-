const { PermissionFlagsBits } = require('discord.js')
module.exports = {
    name: "kick",
    description: "kick un membre du serveur",
    permissions: PermissionFlagsBits.KickMembers,
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à kick",
            required: true
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du kick",
            required: false
        }
    ],
    async run(bot, interaction, args) {
        await interaction.deferReply()

        let user = args.getUser("membre")
        if (!user) return interaction.editReply("Pas de membre à kick !")

        let member = interaction.guild.members.cache.get(user.id)
        if (!member) return interaction.editReply("Ce membre n'est pas dans le serveur !")

        let reason = args.getString("raison")
        if (!reason) reason = "Aucune raison fournie"

        if (interaction.user.id === user.id)
            return interaction.editReply("Vous ne pouvez pas vous kick vous même !")

        if ((await interaction.guild.fetchOwner()).id === user.id)
            return interaction.editReply("Ne kick pas le propriétaire du serveur !")

        if (member && !member?.kickable)
            return interaction.editReply("Je ne peux pas kick ce membre !")

        if (member && interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0)
            return interaction.editReply("Vous ne pouvez pas kick ce membre !")

        try { await user.send(`Vous avez été kick du serveur ${interaction.guild.name} pour la raison : ${reason}`) } catch (err) {}

        await member.kick(reason)
        await interaction.editReply(`${interaction.user} a kick ${user.tag} pour la raison : ${reason}`)
    }
}