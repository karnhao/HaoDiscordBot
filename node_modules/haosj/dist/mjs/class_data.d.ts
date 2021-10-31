import { RawClassData } from './utils/interfaces.js';
export declare class Subject {
    private width;
    private startTime;
    private period;
    private name;
    private id;
    private roomId;
    private teacher;
    private classroom;
    private meet;
    constructor(name?: string);
    /**
     * ตั้ง id.
     * @param {string} id รหัสวิชา.
     */
    setId(id: string | null): void;
    /**
     * ตั้งชื่อวิชา.
     * @param {string} name ชื่อวิชา.
     */
    setName(name: string): void;
    /**
     *
     * @param  {string[]} teacher รายชื่อครูประจำวิชา (array).
     */
    setTeacher(teacher: string[] | null): void;
    /**
     *
     * @param {string} roomId ชื่อห้องเรียนหรือรหัสห้องเรียน.
     */
    setRoomId(roomId: string | null): void;
    /**
     *
     * @param {number} number ระยะเวลาเรียน หน่วยเป็นนาที.
     */
    setWidth(number: number): void;
    /**
     * @param {number} number หมายเลขคาบในวิชา.
     */
    setPeriod(number: number | null): void;
    /**
     * @param {number} time เวลาในหน่วยนาที นับตั้งแต่ 0:00น.
     */
    setStartTime(time: number): void;
    /**
     *
     * @param {string} url url ห้องเรียน
     */
    setClassroomUrl(url: string | null): void;
    /**
     *
     * @param {string} url url เข้าห้องประชุม
     */
    setMeetUrl(url: string | null): void;
    /**
     *
     * @returns {string} รหัสวิชา
     */
    getId(): string | null;
    getLocaleId(): string;
    /**
     *
     * @returns {string} รหัสวิชาในรูปแบบที่ให้ ai อ่าน.
     */
    getLocaleSpeakId(): string;
    /**
     *
     * @returns {string} ชื่อวิชา
     */
    getName(): string | null;
    /**
     *
     * @returns {string} ชื่อวิชา
     */
    getLocaleName(): string;
    /**
     *
     * @returns รายชื่อครูประจำวิชา (array).
     */
    getTeacher(): string[] | null;
    /**
     *
     * @returns รายชื่อครูประจำวิชาในภาษามนุษย์ทั่วไป
     */
    getLocaleTeacherName(): string;
    /**
     *
     * @returns ชื่อห้องเรียนหรือรหัสห้องเรียน.
     */
    getRoomId(): string | null;
    /**
     *
     * @returns {string}
     */
    getLocaleRoomId(): string;
    /**
     *
     * @returns {number} ระยะเวลาเรียน หน่วยเป็นนาที.
     */
    getWidth(): number;
    /**
     *
     * @returns {number} หมายเลขคาบในวิชา.
     */
    getPeriod(): number | null;
    getLocalePeriod(): string;
    /**
     *
     * @returns {number} เวลาเมื่อเริ่มต้นคาบเรียนในรูปแบบนาทีที่นับตั้งแต่ 0:00น.
     */
    getStartTime(): number;
    getLocaleStartTime(): string;
    /**
     *
     * @returns {number} เวลาเมื่อจบคาบเรียนในรูปแบบนาทีที่นับตั้งแต่ 0:00น.
     */
    getEndTime(): number;
    getLocaleEndTime(): string;
    getLocaleTime(): string;
    /**
     * ส่งกลับข้อความที่เป็นภาษามนุษย์
     * @returns {string} ข้อความที่มนุษย์อ่านได้
     */
    getLocaleString(): string;
    /**
     * ส่งกลับข้อความสำหรับให้ ai อ่าน.
     * @returns {string} ข้อความที่มนุษย์อ่านได้.
     */
    getLocaleSpeakString(): string;
    getClassroomUrl(): string | null;
    getMeetUrl(): string | null;
    getStartTimeDate(): Date;
}
export declare class ClassData {
    currentDate: Date;
    currentDay: number;
    /**
     * _เวลาที่เป็นหน่วยนาทีตั้งแต่ 0:00น ถึงปัจจุบัน._
     */
    currentMinutes: number;
    currentSubjectDay: SubjectDay;
    currentPariod: number;
    currentSubject: Subject | null;
    /**
    *
    * @param {RawClassData} data
    * @param {Boolean} showMessage false is default.
    */
    update(showMessage?: boolean, data?: RawClassData): void;
    private oldRawData;
    private data;
    private sd;
    /**
     *
     * @param {Number} day ตัวเลขจำนวนเต็ม.
     * @returns {SubjectDay} จะส่งค่ากลับแบบ SubjectDay.
     */
    get(day: number): SubjectDay;
    /**
     *
     * @param {Number} day ตัวเลขจำนวนเต็ม.
     * @returns {SubjectDay[]} จะส่งค่ากลับในรูปแบบ Array.
     */
    get(): SubjectDay[];
    /**
     * อัพเดตเวลาแต่ละคาบของทุกวัน.
     */
    updateAllDay(): void;
    /**
     * สามารถโหลดหรือดูตัวอย่างข้อมูลดิบที่จะนำมาใส่ใน parameter ของฟังก์ชันนี้ได้ที่.
     *  - https://raw.githubusercontent.com/karnhao/HaoWidget/main/subject_data/6-10/6-10.json
     * @param {RawClassData} object ข้อมูลดิบ.
     * @param {boolean} showMessage
     */
    setData(object: RawClassData, showMessage?: boolean): void;
    /**
     * @deprecated
     * @param {number} number เวลาเริ่มต้นคาบแรก นับตั้งแต่จุดเริ่มต้นของวัน (0:00น) หน่วยเป็นนาที.
     */
    setStartTime(number: number): void;
    /**
     *
     * @param {string} id id ห้องเรียน.
     */
    setClassId(id: string): void;
    /**
     *
     * @param {string} name ชื่อห้องเรียน.
     */
    setClassName(name: string): void;
    /**
     *
     * @param {Subject} subject วิชาว่าง
     */
    setNullSubject(subject: Subject): void;
    /**
     *
     * @param {Date} date วัน.
     * @returns {Subject} วิชา.
     */
    getSubjectByDate(date: Date): Subject | null;
    /**
     *
     * @returns startTime
     * @deprecated
     */
    getStartTime(): number;
    getClassName(): string;
    getClassId(): string;
    /**
     *
     * @returns {Subject} วิชาว่าง.
     */
    getNullSubject(): Subject;
}
export declare class SubjectDay {
    constructor(day: number);
    private subjects;
    private day;
    private startTime;
    private nullSubject;
    /**
     * อัพเดตเวลาแต่ละคาบของวันนี้.
     * method นี้จะถูกเรียกใช้ตอนมีการเรียกใช้ setSubject
     */
    update(): void;
    /**
     *
     * @param  {Subject[]} subject
     */
    setSubject(subject: Subject[]): void;
    setNullSubject(subject: Subject): void;
    setStartTime(startTime: number): void;
    getNullSubject(): Subject;
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
    getSubject(p: number): Subject | null;
    /**
     *
     * @returns {Subject[]} วิชา
     */
    getSubjectList(): Subject[];
    getStartTime(): number;
    /**
     *
     * @param {Number} timeminute เวลาตั้งแต่จุดเริ่มต้นของวัน (0:00น) หน่วยเป็นนาที.
     * @returns {Subject} วิชา.
     */
    getSubjectByTime(timeminute: number): Subject | null;
    /**
     *
     * @param {Number} timeminute เวลาตั้งแต่จุดเริ่มต้นของวัน (0:00น) หน่วยเป็นนาที.
     * @returns {Number} คาบ.
     */
    getPeriodByTime(timeminute: number): number;
    /**
     *
     * @returns {string} ข้อมูลรายวิชาในวันนี้ที่มนุษย์สามารถอ่านได้ง่าย.
     */
    getLocaleSubjectList(): string;
    getDay(): number;
}
