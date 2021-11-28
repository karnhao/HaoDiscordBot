import discord from "discord.js";
import { Config } from "../utils/config.js";

export const name = 'wand';
export const description = 'get wooden axe to inventory.';
/**
 * 
 * @param {discord.Message} message 
 * @param {String[]} args 
 */
export async function execute(message, args) {
    let buttons = [
        new discord.MessageButton()
            .setStyle('LINK')
            .setLabel('ดูวิธีซื้อ premium')
            .setURL('https://youtu.be/QtBDL8EiNZo'),
        new discord.MessageButton()
            .setStyle('LINK')
            .setLabel('เรียนรู้เพิ่มเติม')
            .setURL('https://youtu.be/QtBDL8EiNZo')
    ];
    let actionRow = new discord.MessageActionRow().addComponents(buttons);
    await message.channel.send({
        components: [actionRow],
        embeds: [
            new discord.MessageEmbed()
                .setColor(Config.getColor())
                .setTitle('❌คำสั่งนี้เป็นคำสั่งแบบ premium')
                .setDescription('สามารถใช้คำสั่งนี้โดยไปซื้อเป็นระดับ premium ที่ลิงค์ด้านล่าง')
                .setFooter('ตอนนี้กระหน่ำลดราคา 70% ภายในปี 2021 เท่านั้น!!')
        ]
    });
}