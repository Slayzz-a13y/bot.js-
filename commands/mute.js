const Discord = require("discord.js")
const ms = require("ms")
module.exports = {
    name: "mute", 
    description: "Mute un membre du serveur",
    permissions: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    options: [
        {
            type: "user",
            name: "membre", 
            description: "Le membre à mute",
            required: true
        },
        {
            type: "string",
            name: "temps",
            description: "La durée du mute",
            required: true
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du mute",
            required: false
        }
    ],
    async run(bot, interaction, args){
        let user = args.getUser("membre")
        if(!user) return interaction.reply("Pas de membre à mute !")
        let member = interaction.guild.members.cache.get(user.id)
        if(!member) return interaction.reply("Ce membre n'est pas dans le serveur !")
        let time = args.getString("temps")
        if(!time) return interaction.reply("Pas de temps !")
        if(isNaN(ms(time))) return interaction.reply("Temps invalide !")
        if(ms(time) > 2419200000) return interaction.reply("Le temps ne peut pas être supérieur à 28 jours!")
        let reason = args.getString("raison")
        if(!reason) reason = "Aucune raison fournie"
        if(interaction.user.id === user.id) return interaction.reply("Vous ne pouvez pas vous mute vous même !")
        if((await interaction.guild.fetchOwner()).id === user.id) return interaction.reply("Ne mute pas le propriétaire du serveur !")
        if(member && !member?.moderatable) return interaction.reply("Je ne peux pas mute ce membre !")
        if(member && interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return interaction.reply("Vous ne pouvez pas mute ce membre !")
        if(member.isCommunicationDisabled()) return interaction.reply("Ce membre est déjà mute !")

        await member.timeout(ms(time), reason)

        // Sauvegarde en DB
        await bot.db.query(
            `INSERT INTO moderation (user_id, guild_id, action, reason, moderator_id) VALUES ($1, $2, $3, $4, $5)`,
            [user.id, interaction.guild.id, `mute (${time})`, reason, interaction.user.id]
        )

        try { 
            await user.send(`Vous avez été mute du serveur **${interaction.guild.name}** pendant ${time} pour la raison : ${reason}`) 
        } catch (err) {}

        await interaction.reply(`✅ ${interaction.user} a mute ${user.tag} pendant ${time} pour la raison : ${reason}`)
    }
}