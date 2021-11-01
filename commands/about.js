import { Message } from "discord.js";
import { getAbout } from "../utils/commandbase.js";

export const name = 'about';
export const description = 'ขอข้อมูลเกี่ยวกับ bot นี้';
/**
 * 
 * @param {Message} message 
 * @param {String[]} args 
 */
export async function execute(message, args) {
    try {
        return await message.channel.send({ embeds: [getAbout()] });
    } catch (e) {
        return await message.channel.send({ content: "WTF?? : " + e });
    }
}