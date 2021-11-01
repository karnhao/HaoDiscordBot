import cs from 'console-stamp';
import { CronJob } from 'cron';
import { Channel } from 'diagnostics_channel';
cs(console);
import fs from "fs";
import haosj from 'haosj';
import { client } from "../main.js";
import { sendSubjectMessage } from './commandbase.js';
import { loadJSONSync } from "./data.js";
import { IntervalSetting } from "./IntervalSetting.js";
import { getDateFromMinute, getTimeMinute, manageData } from "./ufunction.js";
/**
 * @type {{Id:string,Settings:{DataUrl:string,Interval:IntervalSetting}}}
 */
const default_config = {
    Id: "",
    Settings: {
        DataUrl: null,
        Replaceable: true,
        Interval: new IntervalSetting()
    }
}

const default_path = './configs';

class ServersConfig {
    static path = default_path;
    /**
    * @type {Map<string,CronJob[]>}
    */
    static cronJob = new Map();
    /**
     * @type {{Id:string,Settings:{DataUrl:string,Replaceable:boolean,Interval:IntervalSetting}}}
     */
    config = JSON.parse(JSON.stringify(default_config));
    constructor(id) {
        this.config.Id = id;
    }
    save() {
        if (!fs.existsSync(ServersConfig.path)) fs.mkdirSync(ServersConfig.path);
        fs.writeFileSync(`${ServersConfig.path}/${this.config.Id}`, JSON.stringify(this.config, null, 4));
    }
    resetConfig() {
        this.config = JSON.parse(JSON.stringify(default_config));
        this.save();
    }
    resetSetting() {
        this.config.Settings = JSON.parse(JSON.stringify(default_config.Settings));
        this.save();
    }
    resetInterval() {
        this.config.Settings.Interval = JSON.parse(JSON.stringify(default_config.Settings.Interval));
        this.save();
    }
    /**
     * 
     * @param {boolean} boolean 
     */
    setInterval(boolean) {
        if (boolean == null || typeof (boolean) !== 'boolean') return;
        this.config.Settings.Interval.Enable = boolean;
        this.save();
    }
    /**
     * 
     * @param {string[]} channelIds
     */
    setChannelId(channelIds) {
        if (channelIds == null || !Array.isArray(channelIds)) return;
        this.config.Settings.Interval.ChannelId = channelIds;
        this.save();
    }
    /**
     * 
     * @param {number} minute 
     */
    setAlert(minute) {
        if (minute == null || typeof (minute) !== 'number') return;
        this.config.Settings.Interval.AlertBefore = minute;
        this.save();
    }
    /**
     * 
     * @param {string} url 
     */
    setUrlData(url) {
        if (url == null || typeof (url) !== 'string') return;
        this.config.Settings.DataUrl = url;
        this.save();
    }
    /**
     * @param {boolean} bool 
     * @returns 
     */
    setReplaceable(bool) {
        if (bool == null || typeof (bool) !== 'boolean') return;
        this.config.Settings.Replaceable = bool;
        this.save();
    }
    /**
     * 
     * @param {string} channelId 
     */
    addChannelId(channelId) {
        if (channelId == null || typeof (channelId) !== 'string') return;
        this.config.Settings.Interval.ChannelId.push(channelId);
        this.save();
    }
    /**
     * 
     * @param {string} channelId 
     */
    removeChannelId(channelId) {
        let index = this.config.Settings.Interval.ChannelId.indexOf(channelId);
        if (index == -1) throw new Error("ChannelId not found");
        this.config.Settings.Interval.ChannelId.splice(index, 1);
        this.save();
    }

    /**
     * 
     * @returns {Channel[]}
     */
    getIntervalChannels() {
        this.repairIntervalChannels();
        return this.config.Settings.Interval.ChannelId.map((s) => client.channels.cache.get(s));
    }

    repairIntervalChannels() {
        this.config.Settings.Interval.ChannelId = this.config.Settings.Interval.ChannelId.filter((t) => client.channels.cache.has(t))
    }
    /**
     * 
     * @param {{id:string,Settings:{DataUrl:string,Interval:IntervalSetting}}} data 
     * @returns 
     */
    setSettings(data) {
        if (!data) return;
        this.setUrlData(data.Settings.DataUrl);
        this.setInterval(data.Settings.Interval.Enable);
        this.setChannelId(data.Settings.Interval.ChannelId);
        this.setAlert(data.Settings.Interval.AlertBefore);
    }
    manageInterval(showMessage = false) {
        this.cancelInterval();
        if (!haosj.getClass(this.config.Id)) throw new Error("ไม่มี class ที่มี id");
        if (!this.config.Settings.Interval.Enable) return;
        showMessage && console.log(`[Interval] Setting auto message for ${client.guilds.cache.get(this.config.Id).name}...`);
        showMessage && console.log(`[Interval] In channel : ${this.getIntervalChannels().map((c) => c.name).toLocaleString()}`);
        haosj.getClass(this.config.Id).currentSubjectDay.getSubjectList().forEach((s) => {
            let alertDate = getDateFromMinute(s.getStartTime() - this.config.Settings.Interval.AlertBefore);
            if (getTimeMinute(alertDate) <= getTimeMinute(new Date())) return;
            showMessage && console.log("[Interval] " + alertDate.toLocaleTimeString() + " <= " + s.getLocaleName());
            let cron = new CronJob(alertDate, () => {
                let classData = haosj.getClass(this.config.Id);
                classData.update();
                let subject = classData.currentSubjectDay.getSubject(classData.currentPariod + 1);
                this.getIntervalChannels().forEach((u) => {
                    sendSubjectMessage(u, subject, classData, "🤖****ข้อความอัตโนมัติ****");
                });
            });
            cron.start();
            if (!ServersConfig.cronJob.has(this.config.Id)) { ServersConfig.cronJob.set(this.config.Id, [cron]); return; }
            ServersConfig.cronJob.get(this.config.Id).push(cron);
        });
        showMessage && console.log(`[Interval] : manage ${client.guilds.cache.get(this.config.Id).name} complete.`);
    }
    static cancelInterval() {
        serversConfig.list().map((t) => serversConfig.get(t)).forEach((u) => {
            u.cancelInterval();
        });
    }
    cancelInterval() {
        if (!ServersConfig.cronJob.has(this.config.Id)) return;
        ServersConfig.cronJob.get(this.config.Id).forEach((t) => {
            t.stop();
        });
        ServersConfig.cronJob.delete(this.config.Id);
    }
}

export const serversConfig = {
    /**
     * 
     * @param {string} id 
     */
    create(id) {
        if (this.isExist(id)) throw new Error("Already has " + id);
        let o = new ServersConfig(id);
        o.save();
    },
    get(id) {
        !this.isExist(id) && this.create(id);
        let path = `${ServersConfig.path}/${id}`; let data = loadJSONSync(path); let o = new ServersConfig(id);
        o.setSettings(data);
        return o;
    },
    delete(id) {
        if (!fs.existsSync(`${ServersConfig.path}/${id}`)) throw new Error(id + " is not exist.");
        let path = `${ServersConfig.path}/${id}`;
        fs.unlinkSync(path);
    },
    list() {
        return fs.readdirSync(ServersConfig.path);
    },
    /**
     * 
     * @param {string} id 
     * @returns {boolean}
     */
    isExist(id) {
        return this.list().includes(id);
    },
    /**
     * 
     * @param {string} path 
     */
    setSavePath(path) {
        this.path = path;
    },
    /**
     * 
     * @param {boolean} showMessage 
     * @returns {Promise<void>}
     */
    async manage(showMessage = false) {
        return new Promise(async (resolve) => {
            for (let guildId of client.guilds.cache.map((g) => g.id)) {
                showMessage && console.log();
                try {
                    if (!this.isExist(guildId)) this.create(guildId);
                    let serverConfig = this.get(guildId);
                    if (!serverConfig) throw new Error("[ServersConfig] Can't find config.");
                    if (!serverConfig.config.Settings.DataUrl && showMessage) console.warn("[ServersConfig] Can't find DataUrl in config.");
                    showMessage && console.log("[ServersConfig] Start : " + client.guilds.cache.get(guildId).name);
                    try {
                        await manageData('./datas', guildId, showMessage);
                        serverConfig.manageInterval(showMessage);
                    } catch (e) {
                        showMessage && console.warn("[ServersConfig] " + e);
                    }
                    showMessage && console.log("[ServersConfig] End : " + client.guilds.cache.get(guildId).name);
                } catch (e) {
                    showMessage && console.warn(`[ServersConfig] Skiped ${client.guilds.cache.get(guildId).name} : ${e}`);
                }
            }
            console.log("[ServersConfig] Manage serversconfig complete.");
            resolve();
        }).catch((r) => {
            console.warn("[ServersConfig] : " + r);
        });
    }
}