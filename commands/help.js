const Discord = require("discord.js") 
module.exports = {
    name: "help", 
    description: "Affiche l'aide",
    permissions: "Aucune", 
    dm: true,
    options: [
        {
            type: "string", 
            name: "commande",
            description: "La commande à afficher (optionnel)",
            required: false
        }
    ],  
    async run(bot, interaction, args){
        try {
            let command;
            if(args.getString("commande")){
                command = bot.commands.get(args.getString("commande")); 
                if(!command) return interaction.reply("Pas de commande !")
            }
            if(command){
                let embed = new Discord.EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`Aide pour la commande ${command.name}`)
                .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`**Description :** ${command.description}\n**Permission :** ${command.permissions}\n**DM :** ${command.dm ? "Oui" : "Non"}`)
                .setTimestamp()
                .setFooter({ text: `Demandé par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                return interaction.reply({ embeds: [embed] })
            }
            let embed = new Discord.EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Liste des commandes")
            .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
            .setDescription(bot.commands.map(c => `**/${c.name}** - ${c.description}`).join("\n"))
            .setTimestamp()
            .setFooter({ text: `Demandé par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            interaction.reply({ embeds: [embed] })
        } catch(err) {
            console.error(err)
            return interaction.reply("Une erreur est survenue !")
        }
    }
}