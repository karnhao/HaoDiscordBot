import { Message } from "discord.js";
import { getClass, getPariodByArg, sendSubjectMessage, weekday } from '../utils/commandbase.js';

export const name = 'gs';
export const description = 'แสดงวิชา.';
/**
 * 
 * @param {Message} message 
 * @param {String[]} args 
 */
export async function execute(message, args) {
    try {
        let classData = getClass(message.guildId);
        let subject = args[1] ? classData.get(Number.parseInt(args[0]))?.getSubject(Number.parseInt(args[1]) - 1) : classData.currentSubjectDay.getSubject(getPariodByArg(args[0], classData.currentPariod) - 1);
        if (!subject) throw new Error("ไม่มีข้อมูลวิชา.");
        await sendSubjectMessage(message.channel, subject, classData, args[1] && `📚ข้อมูลวิชาในวัน${weekday[Number.parseInt(args[0])]}`);
    } catch (e) {
        return await message.channel.send({ content: "❌" + e });
    }
}