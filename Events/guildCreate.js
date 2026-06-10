const Discord = require('discord.js')

module.exports = {
    name: "guildCreate",
    async run(bot, guild) {
        let db = bot.db;

        db.query(`SELECT * FROM guilds WHERE id = '${guild.id}'`, async(err, req) => {
            if(req.length < 1){
                db.query(`INSERT INTO server (guild, captcha) VALUES ('${guild.id}', 'false')`)
            }
        }) 
    }
}