import discord, { Message, User, MessageButton, MessageActionRow } from "discord.js";
import haosj, { ClassData, Subject } from "haosj";
import { client } from "../main.js";
import { sendSubjectMessage, weekday } from "../utils/commandbase.js";
import { Config } from "../utils/config.js";
import fs from "fs";
import { isFileExist, loadData, loadJSONSync } from "../utils/data.js";
import { serversConfig } from "../utils/serversconfig.js";
import { getdata } from "./commands.js";
import { getDayPeriodString } from "../utils/ufunction.js";

const sdo = {
    errors: {
        custom_id_error: 'ยกเลิกเพราะ id ชนกัน',
        selected_menu_error: 'ยกเลิก'
    },
    execute: {
        rejected: '🚫Rejected.',
        ended: '🛑จบการทำงาน',
        selection_menus: {
            placeholder: 'เลือกว่าจะตั้งค่าอะไร',
            send_content: 'เลือก',
            options: [
                {
                    label: 'ตั้งค่าห้องเรียนอันดับต้น',
                    value: 'primary',
                    description: 'ตั้งค่าชื่อ รหัส วิชาว่าง ของห้องเรียน',
                    emoji: '⚙'
                }, {
                    label: 'ตั้งค่าวิชาของห้องเรียน',
                    value: 'secondary',
                    description: 'ตั้งค่าวิชาในแต่ละวันของห้องเรียน',
                    emoji: '⚙'
                },
                {
                    label: 'ใช้ไฟล์ระบุข้อมูล',
                    value: 'file',
                    description: 'bot จะโหลดไฟล์ข้อมูลห้องเรียนมาแล้วตั้งค่าข้อมูลให้เลย',
                    emoji: '⚙'
                }
            ]
        },

    },
    yesno_buttons: {
        defaults: {
            yesMessage: 'ใช่',
            noMessage: 'ไม่',
            time: 60000
        }

    },
    summit_button: {
        defaults: {
            label: 'Ok',
            time: 60000
        }
    },
    form: {
        cancel_command: `${Config.getPrefix()}cancel`,
        cancel_message: 'ยกเลิก',
        reform: '❌ผิดพลาด. กรุณาใส่ใหม่'
    },
    get_time: {
        errors: {
            out_of_bounds: 'ตอบเช่น 17:30',
            not_a_number: 'NaN ตอบเช่น 17:30'
        }
    },
    get_subject: {
        selection_menus: {
            send_content: 'เลือก',
            placeholder: 'เลือกชนิดของการตั้งวิชา',
            cancel_message: 'ยกเลิก',
            options: [
                { label: 'สร้างวิชา', value: 'h_create_subject', description: 'ระบุชื่อ รหัส ห้องเรียน ครู เวลา ฯลฯ ของวิชา', emoji: '⚙' },
                { label: 'เลือกวิชา', value: 'h_select_subject', description: 'เลือกวิชาที่มีอยู่แล้ว', emoji: '⚙' },
                { label: 'ยกเลิก', value: 'cancel', description: 'ยกเลิกการตั้งวิชาทั้งหมด', emoji: '🛑' }
            ]
        }
    },
    create_subject: {
        errors: {
            day_out_of_bounds: 'ใน 1 อาทิตย์มี 7 วัน เท่านั้น โปรดรายงานถ้าพบเห็น',
            not_a_number: 'NaN',
            negative_time: 'เวลาติดลบ'
        },
        null_filter: [
            'null',
            'undefine',
            'undefined'],
        form: {
            name: 'ระบุชื่อวิชา',
            name_example: '(เช่น 🧪เคมี)',
            id: 'ระบุ id ของวิชา (ถ้าไม่มีให้ตอบ null)',
            id_example: '(เช่น ว31101)',
            room: 'ระบุห้องเรียนของวิชา (ถ้าไม่มีให้ตอบ null)',
            room_example: '(เช่น ห้องทดลองเคมีที่ 2)',
            time: 'ระบุระยะเวลาในคาบนี้ (หน่วยเป็นนาที ตอบเช่น 50)',
            teacher: 'ระบุชื่อครูประจำวิชา (ถ้าไม่มีให้ตอบ null)',
            teacher_example: '(เช่น ครูสมชาย ถ้ามีหลายคนเช่น ครูสมชาย, ครูสมหญิง, ครูขนม)',
            tcc: {
                title: 'ชื่อครู',
                null: '❌ไม่มี',
                check: 'ยืนยันข้อมูลข้างต้นหรือไม่❓',
                yes_button: 'ยืนยัน',
                no_button: 'ไม่'
            },
            classroom: 'ระบุ Classroom url (เช่น https://www.google.com ถ้าไม่มีให้ตอบ null)',
            meet: 'ระบุ Meet url (เช่น https://www.google.com ถ้าไม่มีให้ตอบ null)'
        }
    },
    select_subject: {
        selection_menus: {
            send_content: 'เลือก',
            placeholder: 'เลือกวิชา',
            init_options: [
                { label: 'ยกเลิก', value: 'cancel', description: 'ยกเลิกการตั้งวิชาทั้งหมด', emoji: '🛑' },
                { label: 'กลับ', value: 'back', description: 'กลับไปเลือกการตั้งวิชา', emoji: '↩' }
            ]
        },
        cancel_message: 'ยกเลิก'
    },
    get_subject_day: {
        errors: {
            not_a_number: 'NaN',
            negative_period: 'จำนวนคาบติดลบ',
            limit_period: 'จำนวนคาบเยอะเกินไป ลิมิตที่ 127 คาบ'
        },
        already: {
            title: '🛑คำเตือน',
            description: 'มีข้อมูลวิชาในวันนี้อยู่แล้ว',
            question: 'ดำเนินการต่อหรือไม่',
            yes_button: 'ดำเนินการต่อ',
            no_button: 'ไม่ดำเนินการต่อ',
            cancel: 'Cancel'
        },
        title: 'ตั้งค่าจำนวนคาบ', // + 'ในวัน<ชื่อวัน>'
        description: 'ระบุจำนวนคาบ ซึ่งคาบพักกลางวันหรือช่วงพักก็ให้นับเป็นคาบนึงด้วย'
            + ' เพราะระบบจะมองการพักกลางวันเป็นวิชา ถ้าวันนั้นไม่มีเรียนแม้แต่คาบเดียวให้ใส่ 0 แต่ถ้ามีการพักระหว่างคาบ ก็ไม่ต้องนับเป็นคาบ'
            + ' แต่ให้รวมคาบโดยนำเวลาพักมารวมกับคาบก่อนหน้านี้ได้เลย เช่น คาบ 1 เรียนตอน 8:20น ถึง 9:00น คาบ 2 เรียนตอน 9:10น ถึง 9:50น'
            + ' จะเห็นว่ามีเวลาว่างอยู่ 10 นาทีระหว่างคาบ ช่วงนั้นไม่ต้องนำมาเป็นคาบ แต่ให้นำเวลาไปรวมกันกับคาบ 1 เลย',
        summit_button_content: 'เข้าใจแล้วกด Ok ภายใน 5 นาที',
        summit_button_label: 'Ok',
        form: {
            period: 'ระบุจำนวนคาบของวัน', // + <ชื่อวัน>
            period_example: '(เป็นตัวเลข คำตอบเช่น 9 ถ้าไม่มีให้ใส่ 0)',
            period_0: 'Cancel',
            start_time: 'ระบุเวลาเริ่มต้นคาบแรก (หน่วยเป็น น. ตอบเช่น 8:20)'
        },
        confirm: {
            question: 'ยืนยันข้อมูลข้างต้นหรือไม่❓',
            yes_button: 'ยืนยัน',
            no_button: 'ไม่'
        }
    },
    primary: {
        errors: {
            unreadable: 'เกิดข้อผิดพลาด : อ่านข้อมูลไม่ได้'
        },
        warns: {
            title: '🛑คำเตือน',
            description: 'ตรวจพบข้อมูลห้องเรียนเก่าอยู่แล้ว',
            question: 'ลบข้อมูลเก่าแล้วดำเนินการต่อหรือไม่',
            yes_button: 'ลบ',
            no_button: 'ไม่ลบ'
        },
        title: 'การตั้งข้อมูลวิชา⚙',
        form: {
            name: 'ระบุชื่อห้องเรียน (เช่น ม.6/10, ห้องเรียนน่ารัก , ป.1/1) ⚙',
            id: 'ระบุ id ห้องเรียน (ใส่อะไรก็ได้ เช่น ม72610, c418) ⚙'
        },
        confirm: {
            title: 'Primary Data',
            name: 'ชื่อห้องเรียน⚙',
            id: 'Id ห้องเรียน⚙',
            question: 'ยืนยันข้อมูลข้างต้นหรือไม่❓',
            yes_button: 'ยืนยัน',
            no_button: 'ไม่'
        },
        null_subject: {
            title: 'ใกล้เสร็จแล้ว',
            description: 'คำถามต่อไปจะถามวิชาว่าง ซึ่งจะเห็นวิชานี้ในคาบที่ 0 และคาบหลังสุดท้าย.',
            summit_button_content: 'เข้าใจแล้วกด Ok ภายใน 5 นาที',
            summit_button_label: 'Ok'
        },
        done: {
            title: '✔ Well done',
            description: 'ไปตั้งค่าวิชาของห้องเรียนต่อไปได้เลย'
        }
    },
    secondary: {
        errors: {
            no_data: '❌ไม่พบห้องเรียนให้ตั้งค่าข้อมูลวิชา',
            unreadable: 'เกิดข้อผิดพลาด : อ่านข้อมูลไม่ได้'
        },
        menus: {
            placeholder: 'เลือกวันที่จะตั้งค่า',
            content: 'เลือกวัน'
        },
        done: {
            title: '✔ Well done',
            description: 'ตั้งค่าวิชาในวัน%s แล้ว' // %s = ชื่อวัน
        }
    },
    file: {
        errors: {
            no_file: 'ไม่พบไฟล์',
            unreadable: 'เกิดข้อผิดพลาด : อ่านข้อมูลไม่ได้'
        },
        warns: {
            question: 'วางทับข้อมูลเก่าหรือไม่',
            yes_button: 'ดำเนินการต่อ',
            no_button: 'ยกเลิก'
        },
        title: 'วิธีการตั้งค่าข้อมูลโดยใช้ไฟล์',
        description: 'ส่งไฟล์ข้อมูลมาพร้อมเพิ่มความคิดเห็นว่า \'//setdata -f\' หรือถ้าอยากจะวางทับไฟล์เก่าทันทีก็ให้เติม -R ไป',
        cancel_message: 'ยกเลิก',
        loading: 'กำลังโหลดข้อมูล...',
        done: '⭕เรียบร้อย'
    },
    old_data: 'ข้อมูลเก่า'
};

export const name = 'setdata';
export const description = 'สร้างข้อมูลห้องเรียน🐇';
/**
 * @type {string[]}
 */
var guild_setting = [];
/**
 * 
 * @param {Message} message 
 * @param {User} user 
 * @returns 
 */
const filter = (message) => message.author?.id != client.user?.id;
/**
 * 
 * @param {Message} message 
 * @param {string[]} args 
 */
export async function execute(message, args) {
    if (guild_setting.includes(message.guildId)) {
        await message.reply({ content: sdo.execute.rejected }); return;
    }
    guild_setting.push(message.guildId);

    try {
        if (args[0] == '-f') {
            await readFile(message, args);
            await message.channel.send({ content: sdo.file.done });
            return;
        }
        let menus = new discord.MessageSelectMenu()
            .setCustomId('h_menu')
            .setOptions(sdo.execute.selection_menus.options)
            .setPlaceholder(sdo.execute.selection_menus.placeholder)
            .setMaxValues(1).setMinValues(1);
        let actionRow = new MessageActionRow().addComponents([menus]);
        let sended_message = await message.channel.send({ components: [actionRow], content: sdo.execute.selection_menus.send_content });
        let interaction;
        try {
            /**
             * @type {discord.SelectMenuInteraction}
             */
            interaction = await message.channel.awaitMessageComponent({ componentType: 'SELECT_MENU', time: 20000, filter });
            if (interaction.customId != menus.customId) throw new Error(sdo.errors.custom_id_error);
        } finally {
            await sended_message.delete();
        }
        switch (interaction.values[0]) {
            case 'primary':
                await primary(message);
                break;
            case 'secondary':
                await secondary(message);
                break;
            case 'file':
                await file(message);
                break;
            default: throw new Error(sdo.errors.selected_menu_error);
        }
    } catch (e) {
        await message.channel.send({ content: `${sdo.execute.ended} ${e.message ?? ''}` });
    } finally {
        let index = guild_setting.indexOf(message.guildId);
        if (index != -1) guild_setting.splice(index, 1);
    }
}

/**
 * ส่งกลับ true ถ้ากดใช่ ไม่เช่นนั้น false.
 * @param {Message} message 
 * @param {number} time default is 60000
 * @param {string} question
 * @param {string} yesMessage default is ใช่
 * @param {string} noMessage default is ไม่
 */
export async function yesno_buttons(message, question,
    time = sdo.yesno_buttons.defaults.time,
    yesMessage = sdo.yesno_buttons.defaults.yesMessage,
    noMessage = sdo.yesno_buttons.defaults.noMessage) {
    let value;
    let interaction;
    let b_yes = new MessageButton()
        .setCustomId('b_yes')
        .setLabel(yesMessage)
        .setStyle('SUCCESS')
        .setEmoji('✔');
    let b_no = new MessageButton()
        .setCustomId('b_no')
        .setLabel(noMessage)
        .setStyle('DANGER')
        .setEmoji('❌');
    let actionRow = new MessageActionRow().addComponents([b_yes, b_no]);
    let sended_message = await message.channel.send({ content: question, components: [actionRow] });
    try {
        interaction = await message.channel.awaitMessageComponent({
            componentType: 'BUTTON', time
        });
        if (interaction.customId != b_yes.customId && interaction.customId != b_no.customId) throw new Error(sdo.errors.custom_id_error);
        value = interaction.customId == b_yes.customId;
    } finally {
        await sended_message.delete();
        return value;
    }
}

/**
 * rejected เมื่อ timeout.
 * @param {Message} message 
 * @param {string} content 
 * @param {string} label Ok is default.
 * @param {number} time timeout(ms). 60000 is default.
 */
export async function summitButton(message, content,
    label = sdo.summit_button.defaults.label,
    time = sdo.summit_button.defaults.time) {
    let b_summit = new MessageButton()
        .setCustomId('b_summit')
        .setLabel(label)
        .setStyle('SUCCESS')
        .setEmoji('✔')
    let actionRow = new MessageActionRow().addComponents([b_summit]);
    let sended_message = await message.channel.send({ content, components: [actionRow] });
    try {
        let interaction = await sended_message.awaitMessageComponent({ componentType: 'BUTTON', time });
        if (interaction.customId != b_summit.customId) throw new Error(sdo.errors.custom_id_error);
    } finally {
        await sended_message.delete();
        return;
    }
}

/**
 * @template T default is string.
 * @param {(content:string)=>T} [filterfn] ตรวจสอบหรือแปลงข้อมูล content แล้วเปลียนเป็นค่าที่ถูกส่งกลับในฟังก์ชันนี้
 * `throw new Error(reason)` เพื่อให้ใส่ข้อมูลใหม่ ค่าเริ่มต้นคือจะส่งกลับค่า content ในรูปแบบ string เลย.
 * @param {Message} message 
 * @param {string} question
 * @param {number} time default is 120000
 * @return {Promise<T>}
 */
export async function form(message, question, filterfn = (content) => content, time = 120000) {
    while (true) {
        let value;
        message.channel.send({ content: question });
        value = await message.channel.awaitMessages({ errors: ['time'], max: 1, time, filter });
        if (value.first().content.toLowerCase() == sdo.form.cancel_command) throw new Error(sdo.form.cancel_message);
        try {
            return filterfn(value.first().content);
        } catch (e) {
            message.channel.send({ content: `${sdo.form.reform}${e.message ? ` : ${e.message}` : ''}` });
        }
    }
}

/**
 * @param {Message} message 
 * @param {string} question
 */
async function getTime(message, question) {
    return await form(message, question, (content) => {
        let split = content.split(/[,:.]/);
        if (split.length != 2) throw new Error(sdo.get_time.errors.out_of_bounds);
        let hours = Number.parseInt(split[0]), minutes = Number.parseInt(split[1]);
        if (Number.isNaN(hours) || Number.isNaN(minutes)) throw new Error(sdo.get_time.errors.not_a_number);
        return { hours, minutes }
    });
}

/**
 * @typedef {{name:string,id:string,time:number,teacher:string[],room:string,meet:undefined|string,classroom:undefined|string,startTime:number}} SubjectLike
 * @param {undefined | number} day 0 to 6
 * @param {undefined | number} period
 * @param {Message} message 
 * @param {number} time default is 120000
 * @param {SubjectLike} force
 * @param {Subject[]} addedSubject
 * @return {Promise<Subject>}
 */
async function getSubject(message, period = undefined, day = undefined, time = 120000, force = {}, addedSubject) {
    /**
     * @type {discord.MessageSelectOptionData[]}
     */
    let options = sdo.get_subject.selection_menus.options;
    let menus = new discord.MessageSelectMenu()
        .setCustomId('h_get_subject_menus')
        .setPlaceholder(`${sdo.get_subject.selection_menus.placeholder}${getDayPeriodString(day, period)}`)
        .setOptions(options);
    let interaction;
    let sended_message = await message.channel.send({
        content: sdo.get_subject.selection_menus.send_content,
        components: [
            new MessageActionRow().addComponents([menus])
        ]
    });
    try {
        interaction = await message.channel.awaitMessageComponent({ componentType: 'SELECT_MENU', time, filter });
        if (interaction.customId != menus.customId) throw new Error(sdo.errors.custom_id_error);
    } finally {
        await sended_message.delete();
    }
    if (interaction.values[0] == 'cancel') throw new Error(sdo.get_subject.selection_menus.cancel_message);
    if (interaction.values[0] == options[0].value) {
        return await createSubject(message, period, day, time, force);
    } else {
        return await selectSubject(message, period, haosj.getClass(message.guildId), addedSubject, time, force);
    }
}

/**
 * @param {Message} message 
 * @param {number} period 
 * @param {number} day 
 * @param {number} time 
 * @param {SubjectLike} force 
 */
async function createSubject(message, period = undefined, day = undefined, time = 120000, force = {}) {
    if (day < 0 || day > 6) throw new Error(sdo.create_subject.errors.day_out_of_bounds);
    /**
     * @param {string} content 
     * @returns {undefined | string}
     */
    let g = (content) => sdo.create_subject.null_filter.includes(content.toLowerCase()) ? undefined : content;
    const tsdo = sdo.create_subject;
    let data = {};
    if (force?.name === undefined) data.name = await form(message,
        `${tsdo.form.name}${getDayPeriodString(day, period)} ${tsdo.form.name_example}`, undefined, time);
    if (force?.id === undefined) data.id = await form(message,
        `${tsdo.form.id}${getDayPeriodString(day, period)} ${tsdo.form.id_example}`, (content) => g(content), time);
    if (force?.room === undefined) data.room = await form(message,
        `${tsdo.form.room}${getDayPeriodString(day, period)} ${tsdo.form.room_example}`, (content) => g(content), time);
    if (force?.time === undefined) data.time = await form(message,
        tsdo.form.time, (content) => {
            let number = Number.parseInt(content);
            if (Number.isNaN(number)) throw new Error(tsdo.errors.not_a_number);
            if (number < 0) throw new Error(tsdo.errors.negative_time);
            return number;
        }, time);
    if (force?.teacher === undefined) while (true) {
        data.teacher = await form(message,
            `${tsdo.form.teacher}${getDayPeriodString(day, period)} ${tsdo.form.teacher_example}`,
            (content) => g(content)?.split(',').map((t) => t.trim()));
        await message.channel.send({
            embeds: [new discord.MessageEmbed()
                .setTitle(tsdo.form.tcc.title)
                .setDescription(data.teacher?.toLocaleString() ?? tsdo.form.tcc.null)
                .setColor(Config.getColor())]
        });
        if (await yesno_buttons(message, tsdo.form.tcc.check, undefined, tsdo.form.tcc.yes_button, tsdo.form.tcc.no_button)) break;
    }
    if (force?.classroom === undefined) data.classroom = await form(message, tsdo.form.classroom, g);
    if (force?.meet === undefined) data.meet = await form(message, tsdo.form.meet, g);
    let subject = new Subject(data.name);
    if (force.startTime != null) subject.setStartTime(force.startTime);
    if (data.id != null) subject.setId(data.id);
    if (period != null) subject.setPeriod(period);
    if (data.room != null) subject.setRoomId(data.room);
    if (data.time != null) subject.setWidth(data.time);
    if (data.teacher != null) subject.setTeacher(data.teacher);
    if (data.classroom != null) subject.setClassroomUrl(data.classroom);
    if (data.meet != null) subject.setMeetUrl(data.meet);
    return subject;
}

/**
 * @param {Subject[]} addedSubject
 * @param {Message} message 
 * @param {ClassData} classData 
 * @param {number} time default is 120000
 * @param {SubjectLike} force
 */
async function selectSubject(message, period, classData, addedSubject = [], time = 120000, force = {}) {
    /**
     * @return {discord.MessageSelectOptionData}
     * @param {Subject} subject 
     * @param {number} day 
     */
    let f = (subject, day) => {
        let description = `วัน${weekday[day]} คาบที่ ${subject.getLocalePeriod()} ${subject.getLocaleTeacherName()}`;
        let label = subject.getLocaleName();
        let value = `${day}:${subject.getPeriod()}`;
        /**
         * @param {string} text 
         */
        let ff = (text) => {
            return text.length >= 100 ? text.substring(0, 96) + '...' : text;
        }
        description = ff(description); label = ff(label);
        return {
            label, value, description, emoji: '⚙',
        }
    }
    const tsdo = sdo.select_subject;
    /**
     * @type {discord.MessageSelectOptionData[]}
     */
    let options = JSON.parse(JSON.stringify(tsdo.selection_menus.init_options));
    classData.get().map((t) => { return { day: t.getDay(), subjects: t.getSubjectList() } }).forEach((u) => {
        u.subjects.forEach((s) => {
            options.push(f(s, u.day));
        });
    });
    addedSubject?.forEach((s, index) => {
        options.push({
            label: s.getLocaleName(),
            description: `${s.getLocaleId()} ${s.getTeacher() ? s.getLocaleTeacherName() : ``}`,
            value: `@:${index}`,
            emoji: '🆕'
        });
    });
    let menus = new discord.MessageSelectMenu()
        .setCustomId('h_select_subject')
        .setPlaceholder(tsdo.selection_menus.placeholder)
        .setMinValues(1).setMaxValues(1).setOptions(options);
    let actionRow = new discord.MessageActionRow()
        .addComponents([menus]);
    let sended_message = await message.channel.send({ content: tsdo.selection_menus.send_content, components: [actionRow] });
    let interaction;
    try {
        interaction = await message.channel.awaitMessageComponent({ componentType: 'SELECT_MENU', time });
        if (interaction.customId != menus.customId) throw new Error(sdo.errors.custom_id_error);
    } finally {
        await sended_message.delete();
    }
    let value = interaction.values[0];
    switch (interaction.values[0]) {
        case options[0].value:
            throw new Error(tsdo.cancel_message);
        case options[1].value:
            return null;
        default: break;
    }
    let s;
    if (value.startsWith('@')) {
        s = addedSubject[Number.parseInt(value.split(':')[1])];
    } else {
        let num_value = value.split(':').map((s) => Number.parseInt(s));
        s = classData.get(num_value[0]).getSubject(num_value[1]);
    }
    s.setPeriod(period);
    if (force?.classroom !== undefined) s.setClassroomUrl(force.classroom);
    if (force?.id !== undefined) s.setId(force.id);
    if (force?.meet !== undefined) s.setMeetUrl(force.meet);
    if (force?.name !== undefined) s.setName(force.name);
    if (force?.room !== undefined) s.setRoomId(force.room);
    if (force?.startTime !== undefined) s.setStartTime(force.startTime);
    if (force?.teacher !== undefined) s.setTeacher(force.teacher);
    if (force?.time !== undefined) s.setWidth(force.time);
    return s;
}
/**
 * @typedef {import("haosj").RawClassData} T
 * @param {Message} message 
 * @param {number} day 
 * @param {T} old_data 
 * @param {ClassData} classData
 */
async function getSubjectDay(message, day, old_data) {
    const tsdo = sdo.get_subject_day;
    if (`_${day}` in old_data.subjectList) {
        await message.channel.send({
            embeds: [new discord.MessageEmbed()
                .setTitle(tsdo.already.title)
                .setDescription(tsdo.already.description)
                .setColor(Config.getColor())]
        });
        if (!await yesno_buttons(message,
            tsdo.already.question,
            120000,
            tsdo.already.yes_button,
            tsdo.already.no_button)) throw new Error(tsdo.already.cancel);
        await message.channel.send({ content: sdo.old_data, files: [`datas/${message.guildId}.json`] });
    }
    let dayName = weekday[day];
    /**
     * @type {import("haosj").RawSubjectDay}
     */
    let setting_data = { subjectList: [] }
    await message.channel.send({
        embeds: [new discord.MessageEmbed()
            .setTitle(`${tsdo.title}ในวัน${dayName}`)
            .setColor(Config.getColor())
            .setDescription(sdo.get_subject_day.description)
            .setTimestamp()]
    });
    await summitButton(message, tsdo.summit_button_content, tsdo.summit_button_label, 300000);
    let periodCount = await form(message, `${tsdo.form.period}${dayName} ${tsdo.form.period_example}`, (u) => {
        let number = Number.parseInt(u);
        if (Number.isNaN(number)) throw new Error(tsdo.errors.not_a_number);
        if (number < 0) throw new Error(tsdo.errors.negative_period);
        if (number > 127) throw new Error(tsdo.errors.limit_period);
        return number;
    });
    if (periodCount == 0) throw new Error(tsdo.form.period_0);
    let startTime = await getTime(message, tsdo.form.start_time);
    setting_data.startTime = (startTime.hours * 60) + startTime.minutes;
    for (let i = 0; i < periodCount; i++) {
        let subject;
        let addedSubject = [];
        while (true) {
            subject = await getSubject(message, i, day, 120000, {
                startTime: setting_data.startTime + setting_data.subjectList.map((r) => r.width).reduce((p, c) => c + p, 0)
            },
                addedSubject);
            if (subject != null) {
                await sendSubjectMessage(message.channel, subject);
                if (await yesno_buttons(message,
                    tsdo.confirm.question, undefined, tsdo.confirm.yes_button,
                    tsdo.confirm.no_button)) break;
            }
        }
        addedSubject.push(subject);
        setting_data.subjectList.push({
            name: subject.getName(),
            id: subject.getId(),
            width: subject.getWidth(),
            classroom: subject.getClassroomUrl(),
            meet: subject.getMeetUrl(),
            roomId: subject.getRoomId(),
            teacher: subject.getTeacher()
        });
    }
    return setting_data;
}

/**
 * @param {Message} message 
 */
async function primary(message) {
    /**
     * @typedef {{setName:string,setId:string,periodCount:number[],nullSubject:Subject}} T
     * @type {T}
     */
    let setting_data = {
        periodCount: [],
        setId: null,
        setName: null,
        nullSubject: null
    };
    const tsdo = sdo.primary;
    if (isFileExist(`datas/${message.guildId}.json`)) {
        await message.channel.send({
            embeds: [new discord.MessageEmbed()
                .setTitle(tsdo.warns.title)
                .setDescription(tsdo.warns.description)
                .setColor(Config.getColor())]
        });
        if (!await yesno_buttons(message, tsdo.warns.question, 120000,
            tsdo.warns.yes_button, tsdo.warns.no_button)) throw new Error('Cancel');
        await message.channel.send({ content: sdo.old_data, files: [`datas/${message.guildId}.json`] });
    }
    while (true) {
        await message.channel.send({
            embeds: [new discord.MessageEmbed()
                .setTitle(tsdo.title)
                .setColor(Config.getColor())]
        });
        setting_data.setName = await form(message, tsdo.form.name);
        setting_data.setId = await form(message, tsdo.form.id);
        await message.channel.send({
            embeds: [new discord.MessageEmbed().addFields(
                {
                    name: tsdo.confirm.name,
                    value: setting_data.setName
                },
                {
                    name: tsdo.confirm.id,
                    value: setting_data.setId
                }).setTitle(tsdo.confirm.title).setColor(Config.getColor())]
        });
        if (await yesno_buttons(message, tsdo.confirm.question, undefined,
            tsdo.confirm.yes_button, tsdo.confirm.no_button)) break;
    }
    await message.channel.send({
        embeds: [new discord.MessageEmbed()
            .setTitle(tsdo.null_subject.title)
            .setDescription(tsdo.null_subject.description)
            .setColor(Config.getColor())]
    });
    await summitButton(message, tsdo.null_subject.summit_button_content, tsdo.null_subject.summit_button_label, 300000);
    while (true) {
        setting_data.nullSubject = await getSubject(message, -1, undefined, undefined,
            { classroom: null, id: null, meet: null, room: null, teacher: null, time: null });
        await sendSubjectMessage(message.channel, setting_data.nullSubject, undefined, 'วิชาว่าง');
        if (await yesno_buttons(message, tsdo.confirm.question, undefined,
            tsdo.confirm.yes_button, tsdo.confirm.no_button)) break;
    }
    let sc = serversConfig.get(message.guildId);
    sc.config.Settings.DataUrl = null; sc.save();
    if (haosj.has(message.guildId)) haosj.deleteClass(message.guildId);

    if (!isFileExist(`datas/${message.guildId}.json`)) {
        /**
         * @type {import("haosj").RawClassData}
         */
        let data = { classId: null, className: null, nullSubject: null, subjectList: {} };
        fs.writeFileSync(`datas/${message.guildId}.json`, JSON.stringify(data, undefined, 4));
    }
    /**
     * @type {import("haosj").RawClassData}
     */
    let hdata = loadJSONSync(`./datas/${message.guildId}.json`);
    hdata.classId = setting_data.setId;
    hdata.className = setting_data.setName;
    hdata.nullSubject = setting_data.nullSubject;
    if (!haosj.isReadable(hdata)) throw new Error(tsdo.errors.unreadable);
    fs.writeFileSync(`./datas/${message.guildId}.json`, JSON.stringify(hdata, null, 4));
    haosj.addClassRaw(message.guildId, hdata, false);
    await getdata.execute(message);
    await message.channel.send({
        embeds: [new discord.MessageEmbed()
            .setTitle(tsdo.done.title)
            .setDescription(tsdo.done.description)
            .setColor(Config.getColor())]
    });
}

/**
 * @param {Message} message
 */
async function secondary(message) {
    const tsdo = sdo.secondary;
    if (!haosj.has(message.guildId)) throw new Error(tsdo.errors.no_data);
    let c = haosj.getClass(message.guildId);
    /**
     * @type {import("haosj").RawClassData}
     */
    let hdata = loadJSONSync(`./datas/${message.guildId}.json`);
    /**
     * @type {discord.MessageSelectOptionData[]}
     */
    let options = weekday.map((value, index) => {
        return { label: `วัน${value}`, value: `h_secondary_${index}`, description: `ตั้งวิชาของวัน${value}`, emoji: '⚙' };
    });
    let menus = new discord.MessageSelectMenu()
        .setCustomId('h_secondary_menu')
        .setOptions(options)
        .setPlaceholder(tsdo.menus.placeholder)
        .setMaxValues(1).setMinValues(1);
    let actionRow = new MessageActionRow().addComponents([menus]);
    let sended_message = await message.channel.send({ components: [actionRow], content: tsdo.menus.content });
    let interaction;
    try {
        /**
         * @type {discord.SelectMenuInteraction}
         */
        interaction = await message.channel.awaitMessageComponent({ componentType: 'SELECT_MENU', time: 30000, filter });
        if (interaction.customId != menus.customId) throw new Error(sdo.errors.custom_id_error);
    } finally {
        await sended_message.delete();
    }
    let index = options.map((t) => t.value).indexOf(interaction.values[0]);
    if (index == -1) throw new Error('Something wrong! in setdata.secondary');
    let setSubjectday = await getSubjectDay(message, index, hdata);
    hdata.subjectList[`_${index}`] = setSubjectday;
    let sc = serversConfig.get(message.guildId);
    sc.config.Settings.DataUrl = null; sc.save();
    if (!haosj.isReadable(hdata)) throw new Error(tsdo.errors.unreadable);
    fs.writeFileSync(`./datas/${message.guildId}.json`, JSON.stringify(hdata, null, 4));
    c.update(false, hdata);
    sc.manageInterval(true);
    await getdata.execute(message);
    await message.channel.send({
        embeds: [new discord.MessageEmbed().setColor(Config.getColor()).addFields(c.get(index).getSubjectList().map((s) => {
            return { name: s.getName(), value: `${s.getLocaleTime()}น.`, inline: true }
        }))]
    });
    await message.channel.send({
        embeds: [new discord.MessageEmbed()
            .setTitle(tsdo.done.title)
            .setDescription(tsdo.done.description.replace(/%s/g, weekday[index]))
            .setColor(Config.getColor())]
    });
}
/**
 * 
 * @param {Message} message 
 */
async function file(message) {
    const tsdo = sdo.file;
    await message.channel.send({
        embeds: [new discord.MessageEmbed()
            .setColor(Config.getColor())
            .setTitle(tsdo.title)
            .setDescription(tsdo.description)]
    });
}

/**
 * @param {Message} message 
 * @param {string[]} args 
 */
async function readFile(message, args) {
    const tsdo = sdo.file;
    if (!message.attachments.first().url) throw new Error(tsdo.errors.no_file);
    if (!args.some((u) => u == '-R') && isFileExist(`datas/${message.guildId}.json`)) {
        if (!await yesno_buttons(message, tsdo.warns.question, 300000,
            tsdo.warns.yes_button, tsdo.warns.no_button)) throw new Error(tsdo.cancel_message);
        await message.channel.send({ content: sdo.old_data, files: [`datas/${message.guildId}.json`] });
    }
    let fileUrl = message.attachments.first().url;
    await message.channel.send({ content: tsdo.loading });
    let data = await loadData(fileUrl);
    if (!haosj.isReadable(data)) throw new Error(tsdo.errors.unreadable);
    fs.writeFileSync(`./datas/${message.guildId}.json`, JSON.stringify(data, null, 4));
    let sc = serversConfig.get(message.guildId);
    sc.config.Settings.DataUrl == null; sc.save();
    haosj.getClass(message.guildId).update(false, data);
    sc.manageInterval(true);
}