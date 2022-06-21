import { Message } from "discord.js";
import open from "open";
import { publicIpv4 } from "public-ip";
import { Config } from "../utils/config.js";

export const name = 'start-server';
export const description = 'start a minecraft server';
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
        if (args.length != 1) throw new Error(`.${Config.getPrefix()}${name} <password>`);
        if (args[0] != password) throw new Error('incorrect password.');
        if (running) throw new Error('already running.');
        if (cooldown) throw new Error('reject due cooldown.');
        console.warn('Warning : someone opening a minecraft server.');
        console.log(`[Info] username:${message.author.username} guild:${message.guild.name} channel:${message.channel.toString()}`);
        console.log('Opening minecraft server...');
        await message.channel.send({ content: `${message.author.username} run command ${Config.getPrefix()}${name} ##########` });
        running = true;
        open('commands/run-server.bat', { wait: true }).then(() => {
            running = false;
        }).catch((e) => {
            running = false;
            throw e;
        });
        let ip;
        try {
            ip = await publicIpv4();
        } catch (e) {
            ip = 'มีบางอย่างผิดพลาด ติดต่อเจ้าของเซิฟเพื่อขอ ip';
        }
        await message.channel.send({ content: `กำลังเปิดเซิฟเวอร์มานคราฟ, ip ในการเข้าเซิฟ : ${ip}:25565 ...` });
        cooldown = true;
        setTimeout(() => {
            cooldown = false;
        }, 30000);
    } catch (e) {
        await message.channel.send({ content: e.message ?? 'มีบางอย่างผิดพลาด!' });
    }
}