import { Message } from "discord.js";
import fs from "fs";

export const name = 'getdata';
export const description = 'ขอข้อมูลห้องเรียน';
/**
 * @param {Message} message
 * @param {String[]} args
 */
export async function execute(message, args) {
    try {
        fs.accessSync(`datas/${message.guildId}.json`, fs.constants.F_OK);
        return await message.reply({
            content: '⚙ข้อมูลห้องเรียน',
            files: [`datas/${message.guildId}.json`]
        });
    } catch (e) {
        {
            return await message.reply({
                content: '❌ไม่พบข้อมูลห้องเรียน '
            });
        }
    }
}