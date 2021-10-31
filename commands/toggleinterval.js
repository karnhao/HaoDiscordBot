import cs from 'console-stamp';
cs(console);
import { Message } from "discord.js";
import { serversConfig } from "../utils/serversconfig.js";

export const name = 'toggleinterval';
export const description = 'เปิด/ปิด ระบบส่งข้อความวิชาอัตโนมัติ';

/**
 * 
 * @param {Message} message 
 * @param {string[]} args 
 */
export async function execute(message, args) {
    try {
        !serversConfig.isExist(message.guildId) && serversConfig.create(message.guildId);
        let sc = serversConfig.get(message.guildId);
        sc.setInterval(!sc.config.Settings.Interval.Enable);
        console.log(`Set Settings.Interval.Enable of ${message.guildId} to ${sc.config.Settings.Interval.Enable}`);
        message.channel.send({ content: `⭕${sc.config.Settings.Interval.Enable ? "เปิด" : "ปิด"}การส่งข้อความอัตโนมัติแล้ว` });
        sc.manageInterval(true);
    } catch (e) {
        message.channel.send({ content: "❌" + e });
    }
}