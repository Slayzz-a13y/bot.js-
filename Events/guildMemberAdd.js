const Discord = require('discord.js')

module.exports = {
    name: "guildMemberAdd",
    async run(bot, member) {
        try {
            const result = await bot.db.query(`SELECT * FROM guilds WHERE id = $1`, [member.guild.id])
            const req = result.rows

            console.log(`[CAPTCHA] Serveur: ${member.guild.id}, Data:`, req)

            if(req.length < 1 || req[0].captcha === 'false') return console.log('[CAPTCHA] Pas de captcha activé')

            let channel = member.guild.channels.cache.get(req[0].captcha)
            if(!channel) return console.log('[CAPTCHA] Canal introuvable:', req[0].captcha)

            let unverifiedRole = member.guild.roles.cache.find(r => r.name === "Non-vérifié")
            if(unverifiedRole) {
                await member.roles.add(unverifiedRole)
            }

            console.log('[CAPTCHA] Création permissions...')
            await channel.permissionOverwrites.create(member, {
                SendMessages: true,
                ViewChannel: true,
                ReadMessageHistory: true
            })

            let captcha = await bot.function.generateCaptcha()

            let msg = await channel.send({
                content: `${member} vous avez 2 minutes pour résoudre le captcha ! Si vous ne le réussissez pas dans ce délai, vous serez expulsé.`,
                files: [new Discord.AttachmentBuilder((await captcha.canvas).toBuffer(), { name: "captcha.png" })]
            })

            try {
                let filter = m => m.author.id === member.id
                let response = (await channel.awaitMessages({ filter, max: 1, time: 120000, errors: ['time'] })).first()

                if(response.content === captcha.text) {
                    await msg.delete()
                    await response.delete()
            
                    if(unverifiedRole) await member.roles.remove(unverifiedRole)
                    if(req[0].role) await member.roles.add(req[0].role)
                    try { await member.send("Vous avez réussi le captcha, vous avez maintenant accès au serveur !") } catch (err) {}
                    await channel.permissionOverwrites.delete(member)

                } else {
                    await msg.delete()
                    await response.delete()
                    try { await member.send("vous avez échoué le captcha.") } catch (err) {}
                    await channel.permissionOverwrites.delete(member)
                    await member.kick("A raté le captcha.")
                }

            } catch (err) {
                console.log('[CAPTCHA] Erreur:', err)
                await msg.delete()
                try { await member.send("Vous avez mis trop de temps à résoudre le captcha.") } catch (err) {}
                await channel.permissionOverwrites.delete(member)
                await member.kick("N'a pas résolu le captcha à temps.")
            }

        } catch (err) {
            console.log('[CAPTCHA] Erreur globale:', err)
        }
    }
}