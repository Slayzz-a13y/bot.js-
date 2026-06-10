const fs = require('fs')
module.exports = async (bot) => {
    fs.readdirSync('./Events').filter(f => f.endsWith('.js')).forEach(async file => {
        let event = require(`../Events/${file}`)
        if(event.once) {
            bot.once(event.name, event.run.bind(null, bot))
        } else {
            bot.on(event.name, event.run.bind(null, bot))
        }
        console.log(`Evènement ${file} chargé avec succès !`)
    })
}