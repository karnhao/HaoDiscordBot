import cs from 'console-stamp';
cs(console);
import { Config } from "./config.js";
import { client } from "../main.js";
import { sendSubjectMessage, weekday } from "./commandbase.js";
import { CronJob } from "cron";
import fs from "fs";
import { loadJSONSync, loadData } from "./data.js";
import open from "open";
import { serversConfig } from "./serversconfig.js";
import haosj from "haosj";
import { Message } from 'discord.js';

/**
 * ฟังก์ชันนี้จะรับวัตถุวันมาแล้วจะส่งออกข้อมูลในรูปแบบตัวเลขในหน่วยนาทีตั้งแต่จุดเริ่มต้นของวัน
 * @param {Date} date วัตถุวันที่อยู่ในแม่พิมพ์ Date
 * @returns นาทีตั้งแต่จุดเริ่มต้นของวัน
 */
export function getTimeMinute(date) {
    return date.getHours() * 60 + date.getMinutes();
}

/**
 * ส่งกลับวันจากนาที
 * @param {number} minute
 * @returns {Date} วัน
 * @author Sittipat Tepsutar
 */
export function getDateFromMinute(minute) {
    let returndate = new Date();
    returndate.setHours(Math.floor(minute / 60));
    returndate.setMinutes(minute % 60);
    returndate.setSeconds(0);
    returndate.setMilliseconds(0);
    return returndate;
}

/**
 * @deprecated
 * @param {any} subject_data 
 * @param {String[]} channelsID
 * @param {Boolean} showMessage default = false.
 */
export function updateAutoMessage(subject_data, channelsID, showMessage = false) {
    // Auto message >>
    showMessage && console.log("Setting auto message...");
    currentSubjectDay.getSubjectList().forEach((s) => {
        let alertDate = getDateFromMinute(s.getStartTime() - Config.getInterval().AlertBefore);
        if (getTimeMinute(alertDate) <= getTimeMinute(new Date())) { return; }
        showMessage && console.log("Auto message in channels at : " + alertDate.toLocaleTimeString());
        new CronJob(alertDate, function () {
            update(subject_data);
            let subject = currentSubjectDay.getSubject(currentPariod + 1);
            channelsID.map((t) => client.channels.cache.get(t)).forEach((u) => {
                sendSubjectMessage(u, subject, "🤖****ข้อความอัตโนมัติ****");
            });
            if (Config.getAutoMeet() && subject.getMeetUrl()) {
                open(subject.getMeetUrl());
            }
        }).start();
    });
}

/**
 * @param {string} folderPath 
 * @param {string} id 
 * @return {Promise<string>} Promise\<Response text : string\>
 */
export async function manageData(folderPath = './datas', id, showMessage = false) {
    return new Promise(async (resolve, reject) => {
        let saveExists = false;
        let downloadOK = true;
        let data;

        try {
            fs.accessSync(`${folderPath}/${id}.json`, fs.constants.F_OK);
            showMessage && console.log("Found save data.");
            data = loadJSONSync(`${folderPath}/${id}.json`);
            saveExists = true;
        } catch (e) {
            showMessage && console.log("Can't find save data.");
        }

        if (!(saveExists && !Config.getAllowReplace())) {
            //download
            try {
                let url = serversConfig.get(id).config.Settings.DataUrl;
                showMessage && console.log("Downloading subject data from " + url);
                if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
                let lData = await loadData(url);
                if (!haosj.isReadable(lData)) throw new Error('Unable to save file : This data isn\'t readable.');
                data = lData;
                fs.writeFileSync(`${folderPath}/${id}.json`, JSON.stringify(data, null, 4));
                showMessage && console.log(`subject data saved at ${folderPath}/${id}.json.`);
            } catch (e) {
                downloadOK = false;
                showMessage && console.warn("Save file failed : " + e);
            }
        }

        if (data) {
            try {
                if (showMessage) console.log('Storing data to memory...');
                if (!haosj.getClass(id)) { haosj.addClassRaw(id, data, false); }
                else { haosj.getClass(id).update(false, data); };
                resolve(`${downloadOK ? '⭕เรียบร้อย' : ' ⚠คำเตือน : มีปัญหาขึ้นในข้อมูลใหม่จึงใช้ข้อมูลเก่าแทน'}`);
            } catch (e) {
                reject("เกิดข้อผิดพลาดขึ้นระหว่างการอ่านไฟล์");
            }
        } else {
            reject("ไม่สามารถโหลดข้อมูลได้ทุกกรณี :(");
        }
    });
}

/**
 * @deprecated
 * @param {String} folderPath 
 * @param {String} filename 
 * @returns 
 */
export async function deprecated_manageData(folderPath = './data', filename = 'subject_data.json') {
    return new Promise(async (resolve, reject) => {
        let saveExists = false;
        let json;
        try {
            fs.accessSync(`${folderPath}/${filename}`, fs.constants.F_OK);
            console.log("Found save data.");
            saveExists = true;
        } catch (e) {
            console.log("Can't find save data.");
        }
        if (!Config.getAllowReplace() && saveExists) {
            console.log("Download was rejected, due to allow_replace is false.");
            console.log("Reading save file...");
            try {
                json = loadJSONSync(`${folderPath}/${filename}`);
            } catch (e) {
                console.error("Error : " + e);
                reject(e);
            }
        }

        if (!json) {
            console.log("Downloading subject data from " + Config.getDataUrl());
            try {
                if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
                json = await loadData(Config.getDataUrl());

                fs.writeFileSync(`${folderPath}/${filename}`, JSON.stringify(json, null, 4));
                console.log(`subject data saved at ${folderPath}/${filename}.`);
            } catch (e) {
                console.error("Save file failed : " + e);
                reject(e);
            }
        }
        resolve(json);
        console.log("TEST UNDER RESOLVE!");
    });
}

/**
 * 
 * @param {number} length ความยาวของข้อความที่จะถูกสุ่ม.
 * @param {string} characters ตัวอักษรที่จะถูกสุ่ม default=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
 * @returns 
 */
export function randomString(length, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let result = '';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
/**
 * ข้อความที่ผิดกฎหมายจะถูกลบออก.
 * @param {Message} message ข้อความที่จะถูกลบ.
 * @param {string} reason default = '🛑Illegal content in message.'
 * @param {Promise<void>}
 */
export async function illegalMessage(message, reason = '🛑Illegal content in message.') {
    try {
        if (reason) await message.reply({ content: reason });
        await message.delete();
    } catch (e) {
        console.warn('Something wrong in ' + `${message.guild.name} : ` + e?.message ?? '');
    }
}

/**
 * @param {string} string 
 * @param {...string} searchString
 * @return {boolean}
 */
export function includeAll(string, ...searchString) {
    return searchString.every((u) => string.includes(u));
}

/**
 * @param {string} string 
 * @param  {...string} searchString 
 * @returns {boolean}
 */
export function includeSome(string, ...searchString) {
    return searchString.some((t) => string.includes(t))
}

/**
 * @param {number} day 
 * @param {number} period 
 */
export function getDayPeriodString(day, period) {
    // อย่าแตะ!
    return period != null || day != null
        ? `ใน${day != null ? `วัน${weekday[day]}${period != null ? ` ` : ``}` : ``}${period != null ? `คาบที่${period + 1}` : ``}` : ``;
}