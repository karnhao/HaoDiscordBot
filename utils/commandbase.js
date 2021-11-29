import discord from "discord.js";
import { project, client, client_commands } from "../main.js";
import haosj, { ClassData, Subject } from "haosj";
import { Config } from "./config.js";
import { serversConfig } from "./serversconfig.js";
import fs from "fs";

export const weekday = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤษหัสบดี", "ศุกร์", "เสาร์"];

/**
 * @param {ClassData} classData
 * @param {discord.TextBasedChannels} channel 
 * @param {Subject} subject 
 */
export async function sendSubjectMessage(channel, subject, classData = null, title = "📚ข้อมูลวิชา") {
    return await channel.send({ embeds: [getSubjectEmbed(subject, classData, title)] });
}

/**
 * 
 * @param {Subject} subject 
 * @param {String} title 
 * @param {ClassData} classData
 * @returns {discord.MessageEmbed}
 */
export function getSubjectEmbed(subject, classData = null, title = "📚ข้อมูลวิชา") {
    let classroom_url = null;
    let meet_url = null;
    let meet_id = null;
    classroom_url = subject.getClassroomUrl();
    meet_url = subject.getMeetUrl();
    meet_id = meet_url ? subject.getMeetUrl().replace(/[a-z.\/:]+\//, "") : null;
    let embed = new discord.MessageEmbed()
        .setColor(Config.getColor())
        .setTitle(title)
        .setFooter(`HaoDiscordBot v.${project.version} by ${project.author}. license : ${project.license}`);
    if (classData != null) embed.setDescription(`ข้อมูลของ ${classData.getClassName()} • ID : ${classData.getClassId()}🍕🎃`);
    embed.addField(`⚡คาบที่ : ${subject.getLocalePeriod()}`, `- ${getSplashText()}`, true);
    embed.addField(`📝วิชา : `, `- ${subject.getLocaleName()}`, true);
    embed.addField(`👩‍🏫ผู้สอน : `, subject.getLocaleTeacherName() ? `- ${subject.getLocaleTeacherName()}` : `- ❌ไม่สามารถระบุได้`, false);
    embed.addField(`⌛เรียนตอน : `, `- ${subject.getLocaleTime()}น.`, true);
    embed.addField(`🚗เรียนที่ : `, subject.getRoomId() ? `- ${subject.getRoomId()}` : `- ❌ไม่สามารถระบุได้`, true);
    embed.addField(`🏠Classroom : `, classroom_url ? `- ${classroom_url}` : `- ❌ไม่มี classroom url.`, false);
    embed.addField("📻Meet : ", meet_url ? `- ${meet_url}` : `- ❌ไม่มี meet url.`, false);
    if (meet_id) {
        embed.addField("🔑รหัสการประชุม : ", `- ${meet_id}`, true);
        embed.setThumbnail("https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v1/web-96dp/logo_meet_2020q4_color_2x_web_96dp.png");
    }
    return embed;
}
/**
 * ส่งกลับค่า null เมื่อแปลงเป็นตัวเลขไม่ได้.
 * @param {String} arg ถ้าไม่ใส่มา จะส่งกลับคาบปัจจุบัน + 1.
 * @return {Number}
 * @throws {Error}
 */
export function getPariodByArg(arg, currentPariod) {
    let out = arg ? Number.parseInt(arg) : currentPariod + 1;
    if (Number.isNaN(out)) throw new Error("ไม่ใช่ตัวเลข : " + arg);
    return out;
}

/**
 * @param {{command:string,description:string}[]} fields
 * @param {String} title 
 * @returns {discord.MessageEmbed}
 */
export function getAbout(title = "เกี่ยวกับ 🤖" + client.user.username, fields) {
    let prefix = Config.getPrefix();
    /**
     * 
     * @param {string} name 
     * @param {string} value 
     */
    let f = (name, value, inline = false) => { return { name: `${prefix + name}`, value: value, inline: inline } };
    let embed = new discord.MessageEmbed()
        .setColor(Config.getColor())
        .setTitle(title)
        .setImage(client.user.avatarURL())
        .setDescription(`bot นี้สามารถบอกและแสดงรายละเอียดของวิชาต่างๆได้ผ่านคำสั่ง และสามารถแสดงวิชาอัตโนมัติล่วงหน้าได้`)
        .setFooter(`${project.name} v.${project.version} by ${project.author}`)
        .addFields(
            f('gs', 'แสดงวิชาปัจจุบัน.📖'),
            f('gs <คาบ>', 'แสดงวิชาในคาบที่กำหนด.📖'),
            f('gs <วัน> <คาบ>', 'แสดงวิชาในวันและคาบที่กำหนด. <วัน> คือตัวเลขระหว่าง 0-6 อาทิตย์(0),จันทร์(1),...,เสาร์(6)📖'),
            f('gns', 'แสดงวิชาถัดไป.📖'),
            f('gls', 'แสดงรายวิชาในวันปัจจุบัน.📖'),
            f('gls <วัน>', 'แสดงรายวิชาในวันที่กำหนด. <วัน> คือตัวเลขระหว่าง 0-6 อาทิตย์(0),จันทร์(1),...,เสาร์(6)📖'),
            f('gas', 'แสดงวิชาทั้งหมดทุกวัน📖'),
            f('edit <วัน> <คาบ>', 'แก้ไขข้อมูลในวิชาในวันและคาบที่กำหนด <วัน> คือตัวเลขระหว่าง 0-6 อาทิตย์(0),จันทร์(1),...,เสาร์(6)⚙'),
            f('about', 'แสดงข้อความแบบนี้🆘'),
            f('help', `เหมือนกับ ${prefix}about🆘`),
            f('seturl <Url>', 'ตั้งค่าที่อยู่ข้อมูล⚙'),
            f('wand', client_commands.get('wand').description + '🪓'),
            f('toggleinterval', client_commands.get('toggleinterval').description + '⚙'),
            f('intervals toggle', client_commands.get('toggleinterval').description + '⚙'),
            f('intervals add <id ห้อง>', 'เพิ่มห้องที่จะมีข้อความอัตโนมัติ⚙'),
            f('intervals remove <id ห้อง>', 'ลบห้องที่จะมีข้อความอัตโนมัติ⚙'),
            f('intervals before <เวลา>', 'ตั้งเวลาที่ข้อความอัตโนมัติจะถูกส่งก่อนถึงคาบหน้า⚙'),
            f('intervals get', 'แสดงการตั้งค่าเกี่ยวกับข้อความอัตโนมัติ⚙'),
            f('intervals reset', 'reset การตั้งค่าทั้งหมดเกี่ยวกับข้อความอัตโนมัติ⚙'),
            f('setdata', 'สร้างข้อมูล⚙'),
            f('setdata -f', 'ใช้ข้อมูลจากไฟล์ที่แนบมาด้วยกับข้อความ'),
            f('getdata', 'รับข้อมูล⚙'),
            f('ps', 'เล่นเพลงจากไฟล์ที่แนบมาในห้องพูดคุยที่ผู้สั่งอยู่'),
            f('start-server <password>', 'เปิดเซิฟมายคราฟแบบ public (ทั่วโลกเข้าได้)')
        )
        .setTimestamp(new Date());
    return embed;
};

/**
 * 
 * @returns {String} ข้อความแบบสุ่ม.
 */
export function getSplashText() {
    let splashTextArr = Config.getSplashText();
    return splashTextArr[getRndInteger(0, splashTextArr.length - 1)];
}

/**
 * 
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number} เลขจำนวนเต็มที่ถูกสุ่มภายในระยะที่กำหนด.
 */
export function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * รับ id มาแล้วส่งกลับห้องเรียน ถ้าไม่พบจะ throw error ออกมา.
 * @param {string} id 
 * @returns {ClassData}
 */
export function getClass(id) {
    let c = haosj.getClass(id);
    if (!c) throw new Error("ไม่มีข้อมูลห้องเรียน.");
    c.update();
    return c;
}

/**
 * @param {string} id 
 * @param {import("haosj").RawClassData} new_data 
 */
export function updateData(id, new_data) {
    let c = haosj.getClass(id);
    let sc = serversConfig.get(id);
    sc.config.Settings.DataUrl = null; sc.save();
    if (!haosj.isReadable(new_data)) throw new Error('ไม่รองรับข้อมูล');
    fs.writeFileSync(`./datas/${id}.json`, JSON.stringify(new_data, null, 4));
    c.update(false, new_data);
    sc.manageInterval(true);
}