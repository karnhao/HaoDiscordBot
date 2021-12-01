import { Message } from "discord.js";
import { getClass, sendSubjectMessage } from "../utils/commandbase.js";

export const name = 'gls';
export const description = 'ขอรายวิชาทั้งหมดในหนึ่งวัน';
/**
 * 
 * @param {Message} message 
 * @param {String[]} args 
 */
export async function execute(message, args) {
    try {
        let classData = getClass(message.guildId);
        let this_sd = args[0] ? classData.get(Number.parseInt(args[0])) : classData.currentSubjectDay;
        if (this_sd == null || Array.isArray(this_sd)) throw new Error("ไม่พบวัน : " + args[0]);
        if (this_sd.getSubjectList().length == 0) throw new Error("ไม่มีข้อมูล.");
        for (let subject of this_sd.getSubjectList()) await sendSubjectMessage(message.channel, subject, classData);
    } catch (e) {
        return await message.channel.send({ content: "❌" + e });
    }
}