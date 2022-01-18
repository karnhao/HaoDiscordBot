import { Message } from "discord.js";
import { getClass, getPariodByArg, sendSubjectMessage } from "../utils/commandbase.js";

export const name = 'gns';
export const description = 'แสดงวิชาถัดไป';
/**
 * 
 * @param {Message} message 
 * @param {String[]} args 
 */
export async function execute(message, args) {
    try {
        let classData = getClass(message.guildId);
        let subject = classData.currentSubjectDay.getSubject(getPariodByArg(null, classData.currentPariod));
        if (subject == null) { throw new Error("ไม่มีข้อมูลวิชา.") }
        await sendSubjectMessage(message.channel, subject, classData, "📚ข้อมูลวิชาต่อไป");
    } catch (e) {
        return await message.channel.send({ content: "❌" + e });
    }
}
