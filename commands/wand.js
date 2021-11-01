import { Message } from "discord.js";

export const name = 'wand';
export const description = 'get wooden axe to inventory.';
/**
 * 
 * @param {Message} message 
 * @param {String[]} args 
 */
export async function execute(message, args) {
    await message.reply({ content: "Left click: select pos #1; Right click: select pos #2"});
}