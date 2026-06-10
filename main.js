const Discord = require('discord.js')
const intents = new Discord.IntentsBitField(3276799)
const bot = new Discord.Client({intents: intents})
const loadCommands = require('./loader/loadCommands')
const loadEvents = require('./loader/loadEvents')
const config = require('./config')
const express = require('express') 
const app = express()
const db = require('./data') 

bot.commands = new Discord.Collection()
bot.colors = "#ffffff"
bot.function = {
    createCaptcha: require('./Function/generateCaptcha'),
}

app.get('/', (req, res) => res.send('Bot is running!')); 
app.listen(3000, () => console.log('Server is running on port 3000'));

bot.commands = new Discord.Collection()
bot.db = db  

console.log('Bot is starting...')
bot.login(config.token)
loadCommands(bot)
loadEvents(bot)

bot.on("messageCreate", async message => {
    if(message.content === "$ping") return bot.commands.get("ping").run(bot, message) 
})