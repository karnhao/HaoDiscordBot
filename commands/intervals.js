import { Message, MessageEmbed } from 'discord.js';
import { client } from '../main.js';
import { Config } from '../utils/config.js';
import { serversConfig } from '../utils/serversconfig.js';
import { toggleinterval } from './commands.js';

export const name = 'intervals';
export const description = 'ตั้งค่าข้อความอัตโนมัติ';

/**
 * 
 * @param {Message} message 
 * @param {string[]} args 
 */
export async function execute(message, args) {
    args = args.map((v) => v.toLowerCase());
    let command = args.shift();
    if (!serversConfig.isExist(message.guildId)) serversConfig.create(message.guildId);
    try {
        let out;
        let sc = serversConfig.get(message.guildId);
        switch (command) {
            case "add":
                if (!message.guild.channels.cache.has(args[0])) throw new Error(`ไม่พบห้องในเซิฟนี้. : ${args[0]}`);
                if (!message.guild.channels.cache.get(args[0]).isText()) throw new Error(`เพิ่มห้องนี้ไม่ได้. : ${message.guild.channels.cache.get(args[0]).toString()}`);
                if (sc.config.Settings.Interval.ChannelId.includes(args[0])) throw new Error(`ห้องนี้ถูกตั้งค่าไว้แล้ว. : ${message.guild.channels.cache.get(args[0]).toString()}`);
                sc.addChannelId(args[0]);
                sc.manageInterval(false);
                out = `เพิ่มห้อง${message.guild.channels.cache.get(args[0]).toString()}ไปในการตั้งค่าแล้ว.`;
                break;
            case "remove":
                if (!sc.config.Settings.Interval.ChannelId.includes(args[0])) throw new Error("ไม่พบห้องที่จะถูกนำออกจากการตั้งค่า");
                sc.removeChannelId(args[0]);
                sc.manageInterval(false);
                out = `ลบห้อง${message.guild.channels.cache.get(args[0]).toString()}ออกจากการตั้งค่าแล้ว.`;
                break;
            case "before":
                let input = Number.parseInt(args[0]);
                if (Number.isNaN(input)) throw new Error("เกิดปัญหาในการอ่านตัวเลข : " + args[0]);
                sc.setAlert(input);
                sc.manageInterval(false);
                out = `ตั้งให้ระบบส่งข้อความอัตโนมัติก่อนถึงเวลาเรียน ${args[0]} นาทีแล้ว.`;
                break;
            case "toggle":
                toggleinterval.execute(message, args);
                sc.manageInterval(false);
                break;
            case "get":
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(Config.getColor())
                            .setTitle("🐇Interval Setting🐇")
                            .addField("⚙เปิดใช้งาน⚙", sc.config.Settings.Interval.Enable.toString(), true)
                            .addField("⌚เตือนก่อนเวลา⌚", sc.config.Settings.Interval.AlertBefore.toString() + " นาที")
                            .addField("⚙ห้อง⚙", (!Array.isArray(sc.config.Settings.Interval.ChannelId) || !sc.config.Settings.Interval.ChannelId.length) ? "ไม่มี" : sc.config.Settings.Interval.ChannelId.map((v) => client.channels.cache.get(v)).toLocaleString())
                    ]
                });
                break;
            case "reset":
                sc.resetInterval();
                sc.manageInterval(false);
                out = "Reset การตั้งค่า Intervals แล้ว";
                break;
            default:
                throw new Error("ไม่พบคำสั่ง.");
        }
        if (out) message.channel.send({ content: "⭕" + out });
    } catch (e) {
        message.channel.send({ content: "❌" + e });
    }
}