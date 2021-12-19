import { Message } from "discord.js";
import { getAbout } from '../utils/commandbase.js';

export const name = 'help';
export const description = 'ขอความช่วยเหลือเกี่ยวกับบอทนี้';
/**
 * 
 * @param {Message} message 
 * @param {String[]} args 
 */
export async function execute(message, args) {
    try {
        return await message.channel.send({ embeds: [getAbout()] });
    } catch (e) {
        return await message.channel.send({ content: "ERROR CODE : ได้ยังไง??? PLEASE REPORT TO THE DEVELOPERS FOR BUG FIX : karnhao/HaoDiscordBot : " + e });
    }
}