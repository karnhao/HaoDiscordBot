import { Message, MessageEmbed } from "discord.js";
import { getClass, weekday } from "../utils/commandbase.js";
import { Config } from "../utils/config.js";

export const name = 'gas';
export const description = 'แสดงวิชาทั้งหมดทุกวัน';

/**
 * 
 * @param {Message} message 
 * @param {string[]} args 
 */
export async function execute(message, args) {
    try {
        let classData = getClass(message.guildId);
        return await message.channel.send({
            embeds: classData.get().filter(o => o.getSubjectList().length > 0).map((t) => {
                return new MessageEmbed()
                    .setTitle(`วัน${weekday[t.getDay()]}`)
                    .setColor(Config.getColor())
                    .setFields(t.getSubjectList().map((s) => {
                        return { name: `คาบที่ ${s.getLocalePeriod()}`, value: s.getLocaleName(), inline: true }
                    }));
            })
        });
    } catch (e) {
        return await message.channel.send({ content: "❌" + e });
    }
}