const Discord = require("discord.js")
module.exports = {
    name: "warn",
    description: "Avertir un utilisateur",
    permissions: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    options: [
        {
            type: "user", 
            name: "membre", 
            description: "L'utilisateur à avertir",
            required: true
        },
        {
            type: "string",
            name: "raison",
            description: "La raison de l'avertissement",
            required: false
        }
    ],
    async run(bot, interaction, args){
        
        let user = args.getUser("membre")
        if(!user) return interaction.reply("Utilisateur introuvable.")
        
        let member = interaction.guild.members.cache.get(user.id)
        if(!member) return interaction.reply("Membre introuvable.")
        
        let reason = args.getString("raison")
        if(!reason) reason = "Aucune raison fournie."

        if (interaction.user.id === user.id)
            return interaction.reply("Vous ne pouvez pas vous warn vous même !")

        if ((await interaction.guild.fetchOwner()).id === user.id)
            return interaction.reply("Ne warn pas le propriétaire du serveur !")

        if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0)
            return interaction.reply("Vous ne pouvez pas warn ce membre !")

        if ((await interaction.guild.members.fetchMe()).roles.highest.comparePositionTo(member.roles.highest) <= 0)
            return interaction.reply("Le bot ne peut pas warn ce membre !")


        await bot.db.query(
            `INSERT INTO moderation (user_id, guild_id, action, reason, moderator_id) VALUES ($1, $2, $3, $4, $5)`,
            [user.id, interaction.guild.id, 'warn', reason, interaction.user.id]
        )

        try {
            await user.send(`Tu as été warn sur **${interaction.guild.name}** par ${interaction.user.tag} pour : ${reason}`)
        } catch (err) {
            console.log("Impossible d'envoyer un message à cet utilisateur.")
        }

        await interaction.reply(`✅ ${user.tag} a été warn pour : ${reason}`)
    }
}