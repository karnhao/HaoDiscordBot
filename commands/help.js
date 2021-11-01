import { Message } from "discord.js";
import { about } from '../commands/commands.js';

export const name = 'help';
export const description = 'ขอข้อมูลเกี่ยวกับ bot นี้';
/**
 * 
 * @param {Message} message 
 * @param {String[]} args 
 */
export async function execute(message, args) {
    await about.execute(message, args);
}