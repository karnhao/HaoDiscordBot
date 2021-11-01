import cs from 'console-stamp';
cs(console);
import { Message, MessageEmbed } from "discord.js";
import haosj from 'haosj';
import { Config } from "../utils/config.js";
import { serversConfig } from "../utils/serversconfig.js";
import { manageData } from "../utils/ufunction.js";
import { yesno_buttons } from './setdata.js';

export const name = "seturl";
export const description = "ตั้งค่าว่า server นี้ใช้วิชาอะไร";
const path = './datas';

/**
 * 
 * @param {Message} message 
 * @return {Promise<void>}
 */
export async function execute(message, args) {
    console.log(`${message.guildId} execute command seturl >>>`);
    let old_url;
    let old_classData;
    try {
        !serversConfig.isExist(message.guildId) && serversConfig.create(message.guildId);
        if (!args[0]) throw new Error(`ไม่พบ url. ใช้ ${Config.getPrefix()}${name} <URL>`);
        old_url = serversConfig.get(message.guildId).config.Settings.DataUrl;
        old_classData = haosj.getClass(message.guildId);
        if (old_classData != null && old_url != args[0]) {
            await message.channel.send({
                embeds: [new MessageEmbed()
                    .setTitle('🛑คำเตือน')
                    .setDescription('มีข้อมูลวิชาในวันนี้อยู่แล้ว')
                    .setColor(Config.getColor())],
                files: [`datas/${message.guildId}.json`]
            });
            if (!await yesno_buttons(message, 'ดำเนินต่อหรือไม่❓', undefined, 'ดำเนินการต่อ', 'ไม่ดำเนินการต่อ')) return;
        }
        serversConfig.get(message.guildId).setUrlData(args[0]);
        await message.channel.send({ content: "⚙ตั้งค่าที่อยู่ข้อมูลเป็น " + args[0] });
        await message.channel.send({ content: "⚙กำลังโหลดข้อมูล..." });
        let response = await manageData(path, message.guildId, true);
        serversConfig.get(message.guildId).manageInterval(true);
        await message.channel.send({ content: response });
    } catch (e) {
        old_url && serversConfig.get(message.guildId).setUrlData(old_url);
        old_classData && haosj.addClass(message.guildId, old_classData);
        await message.channel.send({ content: "❌ผิดพลาด : " + e });
    }
}