const Discord = require('discord.js')
const Canvas = require('canvas') 

module.exports = async => {

    let caracters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let text = [];
    for(let i = 0; i < 6; i++) text.push(caracters[Math.floor(Math.random() * caracters.length)])
    return text.join('')

    const canvas = Canvas.createCanvas(300, 150)
    const ctx = canvas.getContext('2d')

    ctx.font ='35px'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(text,(150 - (ctx.leasureText(text).widht)/2 ), 85)
    return {canvas: canvas, text: text}
}