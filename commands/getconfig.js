import { Message, MessageEmbed } from "discord.js";
import { serversConfig } from "../utils/serversconfig.js";

export const name = 'getconfig';
export const description = 'ขอข้อมูล config'
/**
 * 
 * @param {Message} message 
 * @param {string[]} args 
 */
export async function execute(message, args) {
    !serversConfig.isExist(message.guildId) && serversConfig.create(message.guildId);
    let sc = serversConfig.get(message.guildId);
    return await message.reply({
        embeds: [
            new MessageEmbed().addFields(
                {
                    name: "ที่อยู่ข้อมูล⚙",
                    value: sc.config.Settings.DataUrl ?? '❌ไม่มีข้อมูล'
                },
                {
                    name: "สามารถโหลดข้อมูลทับข้อมูลเก่า⚙",
                    value: sc.config.Settings.Replaceable ? '⭕ใช่' : '❌ไม่ใช่'
                }
            )
        ]
    });
}