import discord, { Message } from "discord.js";
import { weekday } from "../utils/commandbase.js";
import { form, yesno_buttons } from "./setdata.js";
import { ClassData, Subject } from "haosj";
import { getClass, updateData } from "../utils/commandbase.js";
import { loadJSONSync } from "../utils/data.js";
import { getSubjectByRaw } from "../utils/ufunction.js";
import { Config } from "../utils/config.js";

export const name = 'edit';
export const description = 'แก้ไขข้อมูลวิชาที่มีอยู่แล้ว';
const noData = 'ไม่มีข้อมูล';
/**
 * edit <วัน> <คาบ>
 * @param {Message} message 
 * @param {string[]} args 
 */
export async function execute(message, args) {
    try {
        if (args.length != 2) { throw new Error(`${Config.getPrefix()}${name} <วัน> <คาบ>`) }
        let classData = getClass(message.guildId);
        let day = Number.parseInt(args[0]);
        let period = Number.parseInt(args[1]) - 1;
        let subject = classData.get(day)?.getSubject(period);
        if (subject == null) throw new Error("ไม่เจอวิชา.");
        if (period == -1 || period + 1 > classData.get(day).getSubjectList().length) throw new Error("แก้ไขวิชานี้ไม่ได้");
        let newRawSubject;
        while (true) {
            newRawSubject = await createRawSubject(message, subject, 300000);
            let ns = getSubjectByRaw(newRawSubject);
            ns.setStartTime(subject.getStartTime());
            /**
             * @type {{name:string,value:string}[]}
             */
            let change = [];
            /**
             * @param {string | null} s 
             */
            let g = (s) => s == '' || s == null ? noData : s;
            /**
             * @typedef {"getName"|"getLocaleId"|"getLocaleTime"|"getLocaleRoomId"|"getLocaleTeacherName"|"getClassroomUrl"|"getMeetUrl"} SubjectMethod
             * @param {Subject} s1 
             * @param {Subject} s2 
             * @param {string} name
             * @param {SubjectMethod} methodName
             */
            let f = (name, methodName) => {
                if (subject[methodName]() != ns[methodName]()) change.push({ name, value: `${g(subject[methodName]())} >>> ${g(ns[methodName]())}` });
            };
            /**
             * @type {{name:string,method:SubjectMethod}[]}
             */
            let f_temp = [
                { name: "ชื่อ", method: "getName" },
                { name: "รหัส", method: "getLocaleId" },
                { name: "เวลา", method: "getLocaleTime" },
                { name: "ห้องเรียน", method: "getLocaleRoomId" },
                { name: "ผู้สอน", method: "getLocaleTeacherName" },
                { name: "class room", method: "getClassroomUrl" },
                { name: "meet", method: "getMeetUrl" },
            ];
            f_temp.forEach((t) => f(t.name, t.method));
            await message.channel.send({
                embeds: [new discord.MessageEmbed().setTitle(`ข้อมูลวิชาในวัน${weekday[day]}คาบ ${period + 1} ที่ถูกแก้ไข`).setFields(
                    change.map((t) => { return { name: t.name, value: t.value, inline: false } })
                ).setColor(Config.getColor()).setTimestamp()]
            });
            if (await yesno_buttons(message, 'ยืนยันการแก้ไขข้อมูลหรือไม่?', 120000, 'ยืนยัน', 'ไม่ยืนยัน')) break;
        }

        /**
        * @type {import("haosj").RawClassData}
        */
        let hdata = loadJSONSync(`./datas/${message.guildId}.json`);
        hdata.subjectList[`_${day}`].subjectList[period] = newRawSubject;
        updateData(message.guildId, hdata);
        await message.channel.send({ content: '⭕เรียบร้อย' });
    } catch (e) {
        return await message.channel.send({ content: "🛑จบการทำงาน : " + e.message });
    }
}

/**
 * @param {Message} message
 * @param {Subject} subject
 * @param {ClassData} classData
 */
async function createRawSubject(message, subject, time = 300000) {
    /**
     * @param {string} content 
     * @returns {undefined | string}
     */
    let g = (content) => ['null', 'undefine', 'undefined'].includes(content.toLowerCase()) ? undefined : content;
    /**
     * @type {discord.MessageSelectOptionData[]}
     */
    let options = [
        { label: 'ชื่อ', value: 'name', emoji: '⚙', description: `แก้ไขชื่อวิชา (${subject.getName() ?? noData})` },
        { label: 'รหัส', value: 'id', emoji: '⚙', description: `แก้ไขรหัสวิชา (${subject.getId() ?? noData})` },
        { label: 'เวลา', value: 'time', emoji: '⚙', description: `แก้ไขระยะเวลาในวิชา (${subject.getLocaleTime()})` },
        { label: 'ห้องเรียน', value: 'room', emoji: '⚙', description: `แก้ไขห้องเรียน (${subject.getRoomId() ?? noData})` },
        { label: 'ผู้สอน', value: 'teacher', emoji: '⚙', description: `แก้ไขผู้สอน (${subject.getTeacher()?.join() ?? noData})` },
        { label: 'classroom', value: 'classroom', emoji: '⚙', description: `แก้ไข classroom url (${subject.getClassroomUrl() ?? noData})` },
        { label: 'meet', value: 'meet', emoji: '⚙', description: `แก้ไข meet url (${subject.getMeetUrl() ?? noData})` },
        { label: 'ยกเลิก', value: 'cancel', description: 'ยกเลิกการแก้ไขวิชา', emoji: '🛑' }
    ];
    let menus = new discord.MessageSelectMenu()
        .setCustomId('hao_edit_subject')
        .setPlaceholder('เลือก')
        .setOptions(options)
        .setMaxValues(options.length);
    let actionRow = new discord.MessageActionRow().setComponents([menus]);
    let sended_message = await message.channel.send({ content: 'เลือกว่าจะตั้งค่าอะไร', components: [actionRow] });
    let interaction;
    try {
        interaction = await message.channel.awaitMessageComponent({ componentType: 'SELECT_MENU', time });
        if (interaction.customId != menus.customId) throw new Error("CUSTOM ID ERROR");
    } finally {
        await sended_message.delete();
    }
    let value = interaction.values;
    /**
     * @type {import("haosj").RawSubject}
     */
    let new_subject = {
        name: subject.getName(),
        classroom: subject.getClassroomUrl(),
        id: subject.getId(),
        meet: subject.getMeetUrl(),
        roomId: subject.getRoomId(),
        teacher: subject.getTeacher(),
        width: subject.getWidth()
    };
    if (value.includes(options[7].value)) throw new Error('ยกเลิก');
    if (value.includes(options[0].value)) new_subject.name = await form(message, 'ชื่อวิชาใหม่ (จำเป็น)', undefined, time);
    if (value.includes(options[1].value)) new_subject.id = await form(message, 'รหัสวิชาใหม่ (ตอบ null ถ้าไม่มี)', g, time);
    if (value.includes(options[2].value)) new_subject.width = await form(message, 'ระยะเวลาที่เรียนใหม่', (content) => {
        let number = Number.parseInt(content);
        if (Number.isNaN(number)) throw new Error(tsdo.errors.not_a_number);
        if (number < 0) throw new Error(tsdo.errors.negative_time);
        return number;
    }, time);
    if (value.includes(options[3].value)) new_subject.roomId = await form(message, 'ห้องเรียนใหม่ (ตอบ null ถ้าไม่มี)', g, time);
    if (value.includes(options[4].value)) new_subject.teacher = await form(message, 'ผู้สอนใหม่ (ตอบ null ถ้าไม่มี)', (content) => g(content)?.split(',').map((t) => t.trim()), time);
    if (value.includes(options[5].value)) new_subject.classroom = await form(message, 'classroom url ใหม่ (ตอบ null ถ้าไม่มี)', g, time);
    if (value.includes(options[6].value)) new_subject.meet = await form(message, 'meet url ใหม่ (ตอบ null ถ้าไม่มี)', g, time);
    return new_subject;
}