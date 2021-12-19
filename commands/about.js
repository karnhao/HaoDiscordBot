import { Message } from "discord.js";

export const name = 'about';
export const description = 'ขอข้อมูลเกี่ยวกับ bot นี้';
/**
 * 
 * @param {Message} message 
 * @param {String[]} args 
 */
export async function execute(message, args) {
    try {
        return await message.channel.send({ content: "Hao Discord Bot 1.7 Developer Beta | โดย นายสิทธิภัทท์ เทพสุธา" });
    } catch (e) {
        return await message.channel.send({ content: "ERROR CODE : ได้ยังไง??? PLEASE REPORT TO THE DEVELOPERS FOR BUG FIX : karnhao/HaoDiscordBot : " + e });
    }
}
