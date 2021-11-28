import cs from 'console-stamp';
cs(console);
import fs from "fs";
import { loadJSONSync } from "./data.js";
import { randomString } from './ufunction.js';
/**
 * @type {{BotToken:string,Prefix:string,Allow_replace:boolean,Auto_admin_meet:boolean,ColorTheme:string,SplashText:string[],Servers:string[],StatusText:string,ServerPassword:string}}
 */
const default_config = {
    BotToken: "",
    Prefix: "//",
    Allow_replace: true,
    // (Deprecated) Auto_admin_meet will no longer here in futher.
    Auto_admin_meet: false,
    ColorTheme: "#009900",
    SplashText: [
        "เรียนเดี๋ยวนี้!",
        "เรียนด้วย!"
    ],
    StatusText: null,
    ServerPassword: ""
}

/**
 * @type {default_config}
 */
var config = JSON.parse(JSON.stringify(default_config));
/**
 * Just a static class.
 * (ขี้เกียจ export ทุกๆฟังก์ชัน).
 */
export class Config {
    constructor() {
        throw new Error("ไม่สามารถสร้าง object ภายในคลาสนี้ได้.");
    }
    /**
     * ตั้งค่า token.
     * @param {string} token token ของ Bot ตัวนั้น (ข้อมูลไม่ควรให้ใครเห็น).
     */
    static setToken(token) {
        if (typeof token != 'string' || token == null) return;
        config.BotToken = token;
    }
    /**
     * method นี้จะส่ง token ใน config กลับ.
     * @returns {string} token ของ Bot ตัวนั้น (ข้อมูลไม่ควรให้ใครเห็น).
     */
    static getToken() {
        return config.BotToken;
    }
    /**
     * 
     * @param {string} prefix 
     */
    static setPrefix(prefix) {
        if (!prefix) return;
        config.Prefix = prefix;
    }
    /**
     * 
     * @returns {string}
     */
    static getPrefix() {
        return config.Prefix;
    }
    /**
     * 
     * @param {Boolean} replace 
     */
    static setAllowReplace(replace) {
        if (replace == null) return;
        config.Allow_replace = replace;
    }
    /**
     * 
     * @returns {Boolean}
     */
    static getAllowReplace() {
        return config.Allow_replace;
    }

    /**
     * 
     * @param {string} color hex color. For example "#009900".
     */
    static setColor(color) {
        if (typeof color != 'string' || color == null) return;
        config.ColorTheme = color;
    }
    /**
     * 
     * @returns {string} hex color. For example "#009900".
     */
    static getColor() {
        return config.ColorTheme;
    }

    /**
     * 
     * @param {Boolean} value 
     */
    static setAutoMeet(value) {
        if (value == null) return;
        config.Auto_admin_meet = value;
    }

    /**
     * 
     * @returns {Boolean}
     */
    static getAutoMeet() {
        return config.Auto_admin_meet;
    }

    /**
     * 
     * @param {string[]} st 
     */
    static setSplashText(st) {
        if (!st) return;
        config.SplashText = st;
    }
    /**
     * 
     * @param {string} text 
     */
    static setStatusText(text) {
        config.StatusText = text ? text : `${this.getPrefix()}help`;
    }
    /**
     * @returns {string[]}
     */
    static getSplashText() {
        return config.SplashText;
    }
    /**
     * 
     * @returns {string}
     */
    static getStatusText() {
        return config.StatusText;
    }
    /**
     * 
     * @param {string} password 
     */
    static setServerPassword(password) {
        config.ServerPassword = password ? password : randomString(50);
    }
    static getServerPassword() {
        return config.ServerPassword;
    }
    /**
     * ส่งกลับ config obj.
     * @returns {default_config}
     */
    static getConfig() {
        return config;
    }
    /**
     * 
     * @param {default_config} config 
     */
    static setConfig(config) {
        if (!config) return;
        this.setAllowReplace(config.Allow_replace);
        this.setPrefix(config.Prefix);
        this.setToken(config.BotToken);
        this.setColor(config.ColorTheme);
        this.setAutoMeet(config.Auto_admin_meet);
        this.setSplashText(config.SplashText);
        this.setStatusText(config.StatusText);
        this.setServerPassword(config.ServerPassword)
    }
    /**
     * 
     * @param {string} path 
     * @return {Promise<void>}
     */
    static async saveConfig(path) {
        return new Promise((resolve, reject) => {
            try {
                fs.writeFile(path, JSON.stringify(config, null, 4), (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });

            } catch (e) {
                reject(e);
            }
        });
    }
    /**
     * 
     * @param {string} path 
     */
    static saveConfigSync(path) {
        fs.writeFileSync(path, JSON.stringify(config, null, 4));
    }

    /**
     * จัดการไฟล์ Config แบบ synchronous ให้เลย. สบายขึ้นเยอะ.
     * @param {string} path 
     * @param {Boolean} showMessage 
     */
    static manage(path = './config.json', showMessage = false) {
        let data;
        try {
            fs.accessSync(path, fs.constants.F_OK);
            //File exist.
            showMessage && console.log("Reading config file...");
            data = loadJSONSync(path);
        } catch (e) {
            //File isn't exist.
            showMessage && console.log(e.message);
            showMessage && console.log("Creating config.json file...");
            this.saveConfigSync(path);
        }
        showMessage && console.log("Storing config to memory...");
        Config.setConfig(data);
    }
}