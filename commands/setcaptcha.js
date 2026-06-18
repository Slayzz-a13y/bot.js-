const { PermissionFlagsBits } = require('discord.js')

module.exports = {
    name: "setcaptcha",
    description: "Définir le canal de captcha",
    permissions: PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Administration",
    options: [
        {
            type: "string",
            name: "état",
            description: "L'état du captcha (on/off)",
            required: true
        },
        {
            type: "channel",
            name: "canal",
            description: "Le canal de captcha (obligatoire si l'état est on)",
            required: false
        }
    ],
    async run(bot, interaction, args) {

        let etat = args.getString("état")
        if(etat !== "on" && etat !== "off") return interaction.reply("L'état doit être `on` ou `off` !")

        if(etat === "off") {
            await bot.db.query(`UPDATE guilds SET captcha = 'false' WHERE id = $1`, [interaction.guild.id])
            await interaction.reply("Le captcha a été désactivé !")

        } else {

            let channel = args.getChannel("canal")
            if(!channel) return interaction.reply("Vous devez spécifier un canal !")
            channel = interaction.guild.channels.cache.get(channel.id)
            if(!channel) return interaction.reply("Canal invalide !")

            await bot.db.query(
                `INSERT INTO guilds (id, captcha) VALUES ($1, $2) 
                 ON CONFLICT (id) DO UPDATE SET captcha = $2`,
                [interaction.guild.id, channel.id]
            )
            await interaction.reply(`Le captcha a été activé dans le canal ${channel} !`)
        }
    }
}