"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExampleUrlData = exports.useUrlData = void 0;
const haosj_js_1 = __importDefault(require("../haosj.js"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const class_data_js_1 = require("../class_data.js");
/**
 * เป็น asynchronous function.
 * @param {string} url
 * @param {boolean} showMessage default = false
 * @return {Promise<any>} Promise<ข้อมูล>.
 */
function useUrlData(classId, url, showMessage = false) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let x = yield node_fetch_1.default(url, {
                "method": "GET"
            }).then((res) => res.json(), () => {
                reject(new Error("โหลดไฟล์ล้มเหลว."));
            }).catch((e) => {
                reject(e);
            });
            try {
                let c = new class_data_js_1.ClassData();
                c.setData(x);
                haosj_js_1.default.setClass(classId, c);
            }
            catch (e) {
                reject(e);
            }
            resolve(x);
        }));
    });
}
exports.useUrlData = useUrlData;
/**
 * ใช้ข้อมูลตัวอย่าง เป็น asynchronous function
 * ข้อมูลตัวอย่างจะโหลดมาจาก https://raw.githubusercontent.com/karnhao/HaoWidget/main/subject_data/6-10/6-10.json
 * @return {Promise<any>} Promise<ข้อมูล>.
 */
function useExampleUrlData(classId, showMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        return useUrlData(classId, "https://raw.githubusercontent.com/karnhao/HaoWidget/main/subject_data/6-10/6-10.json", showMessage);
    });
}
exports.useExampleUrlData = useExampleUrlData;
