const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: "stats",
    description: "Voir vos statistiques",
    dm: false,
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "L'utilisateur (optionnel)",
            required: false
        }
    ],
    async run(bot, interaction, args) {
        await interaction.deferReply()

        try {
            let targetUser = args.getUser("utilisateur") || interaction.user
            let userId = targetUser.id

            // Récupérer l'utilisateur de la DB
            let user = bot.db.prepare('SELECT * FROM users WHERE id = ?').get(userId)
            
            // Si l'utilisateur n'existe pas, le créer
            if (!user) {
                bot.db.prepare('INSERT INTO users (id, username, points, level) VALUES (?, ?, ?, ?)').run(
                    userId, 
                    targetUser.username, 
                    0, 
                    1
                )
                user = { id: userId, username: targetUser.username, points: 0, level: 1 }
            }

            // Créer l'embed
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`📊 Statistiques de ${targetUser.username}`)
                .setThumbnail(targetUser.displayAvatarURL())
                .addFields(
                    { name: '⭐ Points', value: `${user.points}`, inline: true },
                    { name: '📈 Niveau', value: `${user.level}`, inline: true },
                    { name: 'ID', value: `${user.id}`, inline: false }
                )
                .setTimestamp()

            return interaction.editReply({ embeds: [embed] })

        } catch (err) {
            console.error(err)
            return interaction.editReply("Une erreur est survenue !")
        }
    }
}