/**
 * เป็น asynchronous function.
 * @param {string} url
 * @param {boolean} showMessage default = false
 * @return {Promise<any>} Promise<ข้อมูล>.
 */
export declare function useUrlData(classId: string, url: string, showMessage?: boolean): Promise<any>;
/**
 * ใช้ข้อมูลตัวอย่าง เป็น asynchronous function
 * ข้อมูลตัวอย่างจะโหลดมาจาก https://raw.githubusercontent.com/karnhao/HaoWidget/main/subject_data/6-10/6-10.json
 * @return {Promise<any>} Promise<ข้อมูล>.
 */
export declare function useExampleUrlData(classId: string, showMessage?: boolean): Promise<any>;
