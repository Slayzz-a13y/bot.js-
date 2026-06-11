const Discord = require('discord.js')
const Canvas = require('canvas') 

module.exports = async () => {  // ✅ async () pas async =>

    let caracters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let text = [];
    for(let i = 0; i < 6; i++) text.push(caracters[Math.floor(Math.random() * caracters.length)])
    
    // ✅ Enlever le return prématuré
    // return text.join('')

    const canvas = Canvas.createCanvas(300, 150)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#000000'  // Fond noir
    ctx.fillRect(0, 0, 300, 150)

    ctx.font = '35px Arial'  // ✅ Arial ajouté
    ctx.fillStyle = '#ffffff'
    // ✅ measureText pas leasureText | width pas widht
    ctx.fillText(text.join(''), (150 - (ctx.measureText(text.join('')).width)/2), 85)
    
    return { canvas: canvas, text: text.join('') }  // ✅ Retourner à la fin
}