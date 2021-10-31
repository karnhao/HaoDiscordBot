import cs from 'console-stamp';
cs(console);
import fs from "fs";
import fetch from "node-fetch";

/**
 * 
 * @param {String} path 
 * @returns {Promise<any>}
 */
export async function loadJSON(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, {
            encoding: 'utf8'
        }, (err, data) => {
            if (err) { reject(err); }
            try { resolve(JSON.parse(data)); }
            catch (e) { reject(e); }
        });
    });
}
/**
 * 
 * @param {String} path 
 * @param {{encoding?:any,flag?:String}} option 
 * @returns {any} data
 */
export function loadJSONSync(path, option = { encoding: 'utf8' }) {
    return JSON.parse(fs.readFileSync(path, option));
}

/**
 * โหลดไฟล์ json จาก url.
 * @param {String} url 
 * @returns {Promise<any>}
 */
export async function loadData(url) {
    return fetch(url, { method: 'GET' })
        .then((res) => res.json()).catch((e) => {
            console.warn(e.message);
        });
}

export function isFileExist(path) {
    try {
        fs.accessSync(path, fs.constants.F_OK);
        return true;
    } catch (e) {
        return false;
    }

}