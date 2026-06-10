const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: "modlogs",
    description: "Voir les logs de modération d'un utilisateur",
    dm: false,
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "L'utilisateur",
            required: true
        }
    ],
    async run(bot, interaction, args) {
        await interaction.deferReply()

        try {
            let user = args.getUser("utilisateur")
            
            // Récupérer les logs
            let logs = bot.db.prepare(`
                SELECT * FROM moderation 
                WHERE user_id = ? AND guild_id = ? 
                ORDER BY created_at DESC 
                LIMIT 5
            `).all(user.id, interaction.guild.id)

            if (logs.length === 0) {
                return interaction.editReply(`${user.tag} n'a pas de logs !`)
            }

            let text = ''
            logs.forEach((log, index) => {
                text += `**${index + 1}.** ${log.action.toUpperCase()} - Raison: ${log.reason}\n`
            })

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle(`📋 Modlogs de ${user.username}`)
                .setDescription(text)

            return interaction.editReply({ embeds: [embed] })

        } catch (err) {
            console.error(err)
            return interaction.editReply("Une erreur est survenue !")
        }
    }
}