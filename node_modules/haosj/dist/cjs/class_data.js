"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectDay = exports.ClassData = exports.Subject = void 0;
const dayMinutes = 1439;
class Subject {
    constructor(name) {
        this.width = 0;
        this.startTime = 0;
        this.period = -1;
        this.name = null;
        this.id = null;
        this.roomId = null;
        this.teacher = null;
        this.classroom = null;
        this.meet = null;
        if (name)
            this.name = name;
    }
    /**
     * ตั้ง id.
     * @param {string} id รหัสวิชา.
     */
    setId(id) {
        this.id = id;
    }
    /**
     * ตั้งชื่อวิชา.
     * @param {string} name ชื่อวิชา.
     */
    setName(name) {
        if (typeof name != "string")
            throw new TypeError("Parameter ต้องเป็น string. : " + name);
        this.name = name;
    }
    /**
     *
     * @param  {string[]} teacher รายชื่อครูประจำวิชา (array).
     */
    setTeacher(teacher) {
        this.teacher = teacher;
    }
    /**
     *
     * @param {string} roomId ชื่อห้องเรียนหรือรหัสห้องเรียน.
     */
    setRoomId(roomId) {
        this.roomId = roomId;
    }
    /**
     *
     * @param {number} number ระยะเวลาเรียน หน่วยเป็นนาที.
     */
    setWidth(number) {
        this.width = number;
    }
    /**
     * @param {number} number หมายเลขคาบในวิชา.
     */
    setPeriod(number) {
        if (!Number.isInteger(number) && number)
            throw new TypeError(`Parameter ต้องเป็นตัวเลขที่เป็นจำนวนเต็มเท่านั้น. : ${number}`);
        this.period = number;
    }
    /**
     * @param {number} time เวลาในหน่วยนาที นับตั้งแต่ 0:00น.
     */
    setStartTime(time) {
        this.startTime = time;
    }
    /**
     *
     * @param {string} url url ห้องเรียน
     */
    setClassroomUrl(url) {
        this.classroom = url;
    }
    /**
     *
     * @param {string} url url เข้าห้องประชุม
     */
    setMeetUrl(url) {
        this.meet = url;
    }
    /**
     *
     * @returns {string} รหัสวิชา
     */
    getId() {
        return this.id;
    }
    getLocaleId() {
        return this.id ? this.id : "";
    }
    /**
     *
     * @returns {string} รหัสวิชาในรูปแบบที่ให้ ai อ่าน.
     */
    getLocaleSpeakId() {
        return this.id ? ((inp) => {
            let out = "";
            inp.forEach((t) => {
                out += isNaN(Number(t)) ? `${t}_,` : `${t}`;
            });
            return out.replaceAll("", " ").trim();
        })(this.id.replaceAll("", " ").trim().split(" ")) : "ไม่มีข้อมูล";
    }
    /**
     *
     * @returns {string} ชื่อวิชา
     */
    getName() {
        return this.name;
    }
    /**
     *
     * @returns {string} ชื่อวิชา
     */
    getLocaleName() {
        return this.name ? this.name : "";
    }
    /**
     *
     * @returns รายชื่อครูประจำวิชา (array).
     */
    getTeacher() {
        return this.teacher;
    }
    /**
     *
     * @returns รายชื่อครูประจำวิชาในภาษามนุษย์ทั่วไป
     */
    getLocaleTeacherName() {
        let t_arr = this.teacher;
        if (!t_arr)
            return "";
        let out = "";
        for (let i = 0; i < t_arr.length; i++) {
            out += (i == t_arr.length - 1) ? `${t_arr[i]}` : (i == t_arr.length - 2) ? `${t_arr[i]} และ ` : `${t_arr[i]}, `;
        }
        return out;
    }
    /**
     *
     * @returns ชื่อห้องเรียนหรือรหัสห้องเรียน.
     */
    getRoomId() {
        return this.roomId;
    }
    /**
     *
     * @returns {string}
     */
    getLocaleRoomId() {
        let ins = this.getRoomId();
        if (!ins)
            return "";
        let out = ins[0];
        for (let i = 1; i < ins.length; i++) {
            out += isNaN(Number(ins[i])) || ins[i].match("\\s+") || ins[i - 1].match("\\s+") ? ins[i] : ` ${ins[i]}`;
        }
        return out;
    }
    /**
     *
     * @returns {number} ระยะเวลาเรียน หน่วยเป็นนาที.
     */
    getWidth() {
        return this.width;
    }
    /**
     *
     * @returns {number} หมายเลขคาบในวิชา.
     */
    getPeriod() {
        return this.period;
    }
    getLocalePeriod() {
        return this.period != null ? (this.period + 1).toString() : "";
    }
    /**
     *
     * @returns {number} เวลาเมื่อเริ่มต้นคาบเรียนในรูปแบบนาทีที่นับตั้งแต่ 0:00น.
     */
    getStartTime() {
        return this.startTime;
    }
    getLocaleStartTime() {
        return getLocaleTimeStringFromMinute(this.getStartTime());
    }
    /**
     *
     * @returns {number} เวลาเมื่อจบคาบเรียนในรูปแบบนาทีที่นับตั้งแต่ 0:00น.
     */
    getEndTime() {
        return this.startTime + this.width;
    }
    getLocaleEndTime() {
        return getLocaleTimeStringFromMinute(this.getEndTime());
    }
    getLocaleTime() {
        return `${this.getLocaleStartTime()}-${this.getLocaleEndTime()}`;
    }
    /**
     * ส่งกลับข้อความที่เป็นภาษามนุษย์
     * @returns {string} ข้อความที่มนุษย์อ่านได้
     */
    getLocaleString() {
        return ` คาบที่ ${this.getLocalePeriod()} ของวัน.\n เรียนวิชา : ${this.getName()}.\n รหัส : ${this.getLocaleId()}\n`
            + ` เรียนที่ : ${this.getLocaleRoomId()}\n`
            + ` ตั้งแต่เวลา : ${this.getLocaleStartTime()} น. ถึง ${this.getLocaleEndTime()} น.\n เป็นเวลา : ${this.getWidth()} นาที.\n`
            + ` ครูผู้สอนคือ : ${this.getLocaleTeacherName()}.`;
    }
    /**
     * ส่งกลับข้อความสำหรับให้ ai อ่าน.
     * @returns {string} ข้อความที่มนุษย์อ่านได้.
     */
    getLocaleSpeakString() {
        return ` คาบที่ ${this.getLocalePeriod()} ของวัน.\n ` + (this.name ? `เรียนวิชา : ${this.getName()}.\n` : '') + (this.id ? ` รหัส : ${this.getLocaleSpeakId()}\n` : '')
            + (this.roomId ? ` เรียนที่ : ${this.getLocaleRoomId()}\n` : '')
            + ` ตั้งแต่เวลา : ${this.getLocaleStartTime()} น. ถึง ${this.getLocaleEndTime()} น.\n เป็นเวลา : ${this.getWidth()} นาที.`
            + (this.teacher ? `\n ครูผู้สอนคือ : ${this.getLocaleTeacherName()}.` : '');
    }
    getClassroomUrl() {
        return this.classroom;
    }
    getMeetUrl() {
        return this.meet;
    }
    getStartTimeDate() {
        return getDateFromMinute(this.getStartTime());
    }
}
exports.Subject = Subject;
class ClassData {
    constructor() {
        this.currentDate = new Date();
        this.currentDay = this.currentDate.getDay();
        /**
         * _เวลาที่เป็นหน่วยนาทีตั้งแต่ 0:00น ถึงปัจจุบัน._
         */
        this.currentMinutes = 0;
        this.currentSubjectDay = new SubjectDay(0);
        this.currentPariod = -1;
        this.currentSubject = new Subject();
        this.oldRawData = null;
        this.data = {
            startTime: 0,
            classId: '',
            className: '',
            nullSubject: new Subject()
        };
        this.sd = (function () {
            let out = [];
            for (let i = 0; i < 7; i++) {
                out.push(new SubjectDay(i));
            }
            return out;
        })();
    }
    /**
    *
    * @param {RawClassData} data
    * @param {Boolean} showMessage false is default.
    */
    update(showMessage = false, data = this.oldRawData) {
        this.currentDate = new Date();
        this.currentDay = this.currentDate.getDay();
        // SET DATA
        this.setData(data, showMessage);
        // SET GLOBAL
        this.currentMinutes = getTimeMinute(this.currentDate);
        this.currentSubjectDay = this.get(this.currentDay);
        this.currentPariod = this.currentSubjectDay.getPeriodByTime(this.currentMinutes);
        this.currentSubject = this.currentSubjectDay.getSubject(this.currentPariod);
    }
    get(day) {
        return day != null ? this.sd[Math.floor(day)] : this.sd;
    }
    /**
     * อัพเดตเวลาแต่ละคาบของทุกวัน.
     */
    updateAllDay() {
        this.sd.forEach((t) => {
            t.update();
        });
    }
    /**
     * สามารถโหลดหรือดูตัวอย่างข้อมูลดิบที่จะนำมาใส่ใน parameter ของฟังก์ชันนี้ได้ที่.
     *  - https://raw.githubusercontent.com/karnhao/HaoWidget/main/subject_data/6-10/6-10.json
     * @param {RawClassData} object ข้อมูลดิบ.
     * @param {boolean} showMessage
     */
    setData(object, showMessage = false) {
        var _a, _b, _c, _d, _e, _f;
        this.setClassId(object.classId);
        this.setClassName(object.className);
        this.setNullSubject((function (data) {
            var _a, _b, _c, _d, _e, _f, _g;
            let s = new Subject();
            let raw_s = (_a = data === null || data === void 0 ? void 0 : data.nullSubject) !== null && _a !== void 0 ? _a : { name: "NULL" };
            s.setId((_b = raw_s === null || raw_s === void 0 ? void 0 : raw_s.id) !== null && _b !== void 0 ? _b : null);
            s.setName(raw_s === null || raw_s === void 0 ? void 0 : raw_s.name);
            s.setPeriod(null);
            s.setRoomId((_c = raw_s === null || raw_s === void 0 ? void 0 : raw_s.roomId) !== null && _c !== void 0 ? _c : null);
            s.setStartTime(0);
            s.setTeacher((_d = raw_s === null || raw_s === void 0 ? void 0 : raw_s.teacher) !== null && _d !== void 0 ? _d : null);
            s.setWidth((_e = raw_s === null || raw_s === void 0 ? void 0 : raw_s.width) !== null && _e !== void 0 ? _e : 0);
            s.setClassroomUrl((_f = raw_s === null || raw_s === void 0 ? void 0 : raw_s.classroom) !== null && _f !== void 0 ? _f : null);
            s.setMeetUrl((_g = raw_s === null || raw_s === void 0 ? void 0 : raw_s.meet) !== null && _g !== void 0 ? _g : null);
            return s;
        })(object));
        // set Data from subjectList.
        // loop day 0 to 6.
        showMessage && console.log("Storing subject to memory...");
        for (let i = 0; i < 7; i++) {
            this.get(i).setNullSubject(this.getNullSubject());
            let f = new Function('data', `return data.subjectList._${i};`);
            let sl = f(object);
            (sl === null || sl === void 0 ? void 0 : sl.startTime) && this.get(i).setStartTime(sl === null || sl === void 0 ? void 0 : sl.startTime);
            if (!Array.isArray(sl === null || sl === void 0 ? void 0 : sl.subjectList) || (sl === null || sl === void 0 ? void 0 : sl.subjectList.length) == 0)
                continue;
            showMessage && console.log(`#===============[Day ${i}]================#`);
            let s = [];
            let k = 0;
            // loop subject in subjectList.
            for (let j of sl.subjectList) {
                let raw_object = j;
                let si = new Subject();
                si.setName(raw_object === null || raw_object === void 0 ? void 0 : raw_object.name);
                si.setId((_a = raw_object === null || raw_object === void 0 ? void 0 : raw_object.id) !== null && _a !== void 0 ? _a : null);
                si.setPeriod(k);
                si.setRoomId((_b = raw_object === null || raw_object === void 0 ? void 0 : raw_object.roomId) !== null && _b !== void 0 ? _b : null);
                si.setTeacher((_c = raw_object === null || raw_object === void 0 ? void 0 : raw_object.teacher) !== null && _c !== void 0 ? _c : null);
                si.setWidth((_d = raw_object === null || raw_object === void 0 ? void 0 : raw_object.width) !== null && _d !== void 0 ? _d : 0);
                si.setClassroomUrl((_e = raw_object === null || raw_object === void 0 ? void 0 : raw_object.classroom) !== null && _e !== void 0 ? _e : null);
                si.setMeetUrl((_f = raw_object.meet) !== null && _f !== void 0 ? _f : null);
                s.push(si);
                k++;
                showMessage && console.log(`>> Stored ${i} ${k} ${si.getLocaleId()} ${si.getLocaleName()}`);
            }
            this.get(i).setSubject(s);
            showMessage && console.log("#======================================#\n");
        }
        this.oldRawData = object;
    }
    /**
     * @deprecated
     * @param {number} number เวลาเริ่มต้นคาบแรก นับตั้งแต่จุดเริ่มต้นของวัน (0:00น) หน่วยเป็นนาที.
     */
    setStartTime(number) {
        this.data.startTime = number;
    }
    /**
     *
     * @param {string} id id ห้องเรียน.
     */
    setClassId(id) {
        this.data.classId = id;
    }
    /**
     *
     * @param {string} name ชื่อห้องเรียน.
     */
    setClassName(name) {
        this.data.className = name;
    }
    /**
     *
     * @param {Subject} subject วิชาว่าง
     */
    setNullSubject(subject) {
        this.data.nullSubject = subject;
    }
    /**
     *
     * @param {Date} date วัน.
     * @returns {Subject} วิชา.
     */
    getSubjectByDate(date) {
        return this.get(date.getDay()).getSubjectByTime(getTimeMinute(date));
    }
    /**
     *
     * @returns startTime
     * @deprecated
     */
    getStartTime() {
        return this.data.startTime;
    }
    getClassName() {
        return this.data.className;
    }
    getClassId() {
        return this.data.classId;
    }
    /**
     *
     * @returns {Subject} วิชาว่าง.
     */
    getNullSubject() {
        return this.data.nullSubject;
    }
}
exports.ClassData = ClassData;
class SubjectDay {
    constructor(day) {
        this.subjects = [];
        this.startTime = 0;
        this.nullSubject = new Subject("NULL CODE 1");
        if (!Number.isInteger(day))
            throw new TypeError("Parameter ต้องเป็นจำนวนเต็ม");
        this.day = day;
    }
    /**
     * อัพเดตเวลาแต่ละคาบของวันนี้.
     * method นี้จะถูกเรียกใช้ตอนมีการเรียกใช้ setSubject
     */
    update() {
        let t = this.getStartTime();
        this.subjects.forEach((k) => {
            k.setStartTime(t);
            t += k.getWidth();
        });
    }
    /**
     *
     * @param  {Subject[]} subject
     */
    setSubject(subject) {
        this.subjects = subject;
        this.update();
    }
    setNullSubject(subject) {
        this.nullSubject = subject;
    }
    setStartTime(startTime) {
        this.startTime = startTime;
    }
    getNullSubject() {
        return this.nullSubject;
    }
    /**
     * ระบบมองว่าวิชาไม่มีเป็นวิชาดังตัวอย่าง
     * ```js
     * //ภายใน thisDay มีทั้งหมด 8 วิชา เรียกวิชาแรกด้วย thisDay.getSubject(0) และวิชาสุดท้ายด้วย thisDay.getSubject(7)
     * thisDay.getSubject(-1); // จะได้วิชาจาก nullSubject โดยมีเวลาเริ่มต้นคือ 0:00น. และจบที่ startTime ของ thisDay.
     * thisDay.getSubject(7); // จะได้วิชาปกติจาก thisDay ในที่นี้จะเป็นวิชาสุดท้ายของ thisDay.
     * thisDay.getSubject(8); // จะได้วิชาจาก nullSubject โดยมีเวลาเริ่มต้นคือเวลาจบของวิชาสุดท้ายจนถึง 23:59น.
     * thisDay.getSubject(9); // จะได้ null.
     * thisDay.getSubject(-2); // จะได้ null.
     * ```
     * @param {number} p คาบเรียน index.
     * @returns {Subject} วิชา.
     */
    getSubject(p) {
        // คาบที่ 0.
        if (p == -1) {
            let s = this.getNullSubject();
            if (s) {
                s.setStartTime(0);
                s.setWidth(this.subjects.length > 0 ? this.getStartTime() : dayMinutes);
                s.setPeriod(-1);
            }
            return s;
        }
        let out = this.subjects[Math.floor(p)];
        // Normal value
        if (out != null)
            return out;
        // End subject.
        if (p == this.subjects.length && p != 0) {
            let s = this.getNullSubject();
            let last_subject = this.subjects[this.subjects.length - 1];
            if (s) {
                let last_subject_period = last_subject.getPeriod();
                s.setStartTime((last_subject) ? last_subject.getEndTime() : 0);
                s.setPeriod((last_subject && last_subject_period) ? last_subject_period + 1 : -1);
                s.setWidth(dayMinutes - s.getStartTime());
            }
            return s;
        }
        return null;
    }
    /**
     *
     * @returns {Subject[]} วิชา
     */
    getSubjectList() {
        return this.subjects;
    }
    getStartTime() {
        return this.startTime;
    }
    /**
     *
     * @param {Number} timeminute เวลาตั้งแต่จุดเริ่มต้นของวัน (0:00น) หน่วยเป็นนาที.
     * @returns {Subject} วิชา.
     */
    getSubjectByTime(timeminute) {
        return this.getSubject(this.getPeriodByTime(timeminute));
    }
    /**
     *
     * @param {Number} timeminute เวลาตั้งแต่จุดเริ่มต้นของวัน (0:00น) หน่วยเป็นนาที.
     * @returns {Number} คาบ.
     */
    getPeriodByTime(timeminute) {
        // example output : 
        // in < 500 => -1
        // in 500-549 => 0
        // in 550-599 => 1...
        if (timeminute < this.getStartTime() || this.subjects.length == 0)
            return -1;
        let p = 0;
        for (let i of this.getSubjectList()) {
            if (i.getStartTime() <= timeminute && timeminute < i.getEndTime())
                return p;
            p++;
        }
        return p;
    }
    /**
     *
     * @returns {string} ข้อมูลรายวิชาในวันนี้ที่มนุษย์สามารถอ่านได้ง่าย.
     */
    getLocaleSubjectList() {
        if (!this.getSubjectList().length)
            return "ไม่มีข้อมูล";
        let out = "";
        this.getSubjectList().forEach((t) => {
            out += `${t.getLocaleSpeakString()}\n\n`;
        });
        return out;
    }
    getDay() {
        return this.day;
    }
}
exports.SubjectDay = SubjectDay;
/**
 * ฟังก์ชันนี้จะรับวัตถุวันมาแล้วจะส่งออกข้อมูลในรูปแบบตัวเลขในหน่วยนาทีตั้งแต่จุดเริ่มต้นของวัน
 * @param {Date} date วัตถุวันที่อยู่ในแม่พิมพ์ Date
 * @returns นาทีตั้งแต่จุดเริ่มต้นของวัน
 */
function getTimeMinute(date) {
    return date.getHours() * 60 + date.getMinutes();
}
/**
 * คำนวนเวลา(ในรูปแบบข้อความ string)จากนาที
 * @param {number} minute
 * @returns เวลา
 * @author Sittipat Tepsutar
 * @see getDateFromMinute
 */
function getLocaleTimeStringFromMinute(minute) {
    if (minute == Infinity)
        return "???";
    let pad = (d) => (d < 10) ? '0' + d.toString() : d.toString();
    let t1 = getDateFromMinute(minute);
    return `${pad(t1.getHours())}:${pad(t1.getMinutes())}`;
}
/**
 * ส่งกลับวันจากนาที
 * @param {number} minute
 * @returns {Date} วัน
 * @author Sittipat Tepsutar
 */
function getDateFromMinute(minute) {
    let returndate = new Date();
    returndate.setHours(Math.floor(minute / 60));
    returndate.setMinutes(minute % 60);
    returndate.setSeconds(0);
    returndate.setMilliseconds(0);
    return returndate;
}
