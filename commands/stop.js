import { Message } from "discord.js";
import { client } from "../main.js";
import { Config } from "../utils/config.js";

export const name = 'stop';
export const description = 'stop Hao Discord BOT (DEV1.0)';
var running = false
var cooldown = false;
/**
 * 
 * @param {Message} message 
 * @param {string[]} args 
 */
export async function execute(message, args) {
    const password = Config.getServerPassword();
    try {
        if (args.length != 1) return;
        if (args[0] != password) throw new Error(`WARNING : ${message.author.username} trying to stop and input incorrect password.`);
        console.warn(`Warning :${message.author.username} stopping your discord bot.`);
        console.log(`[Info] username:${message.author.username} guild:${message.guild.name} channel:${message.channel.toString()}`);
        console.log('Stopping Discord bot');
        await message.channel.send({ content: `${message.author.username} run command ${Config.getPrefix()}${name} ##########` });
        await message.channel.send('Shutting down...');
        client.destroy();
    } catch (e) {
        console.warn(e.message ?? 'มีบางอย่างผิดพลาด!');
    }
}