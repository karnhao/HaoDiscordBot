console.log("Loading libraries, please wait...");
import cs from 'console-stamp';
cs(console);
import discord, { Intents } from "discord.js";
import { Config } from "./utils/config.js";
import cms from "./commands/commands.js";
import { loadJSONSync } from "./utils/data.js";
import { serversConfig } from "./utils/serversconfig.js";
import { CronJob } from "cron";
import fs from "fs";
/**
 * @type {{name:String,version:String,description:String,main:String,scripts:any,author:String,license:String,dependencies:any,type:String}}
 */
export const project = loadJSONSync("./package.json");
export const client = new discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});
const configPath = './config.json';
if (!fs.existsSync("temp")) {
    console.log("Create temp directory...");
    fs.mkdirSync("temp");
}
if (!fs.existsSync("./configs")) {
    console.log("Create configs directory...");
    fs.mkdirSync("configs");
}

console.log("Creating commands...");
/**
 * @type {discord.Collection<String,{name:String,description:String,execute(message:discord.Message,args:String[])=>Promise<void|discord.Message>}>}
 */
export const client_commands = new discord.Collection();
console.log("Setting commands...");
cms.forEach((t) => {
    client_commands.set(t.name, t);
});

console.log("Setting config...");
Config.manage(configPath, true);

const token = Config.getToken();
const allow_replace = Config.getAllowReplace();

console.log("Allow_replace : " + allow_replace);

if (!token) throw new Error("No token specified. Please specify token in config.json file.");

console.log("Saving config...");
Config.saveConfigSync(configPath);

/*
# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7)
# |  |  |  |  |
# *  *  *  *  *   command to be executed
*/

console.log("Loading, please wait...");
////////////////////////////////////////////////////////////////////////////////
client.once('ready', async () => {
    await serversConfig.manage(true);
    new CronJob('00 */2 * * * *', () => { // Update every 2 minutes.
        client.user.setPresence({
            activities: [
                {
                    name: Config.getStatusText(),
                    type: 'PLAYING'
                }
            ]
        });
    }, () => { console.log("Stop updating activities."); }, true, ...[, ,], true);

    new CronJob('01 00 00 * * *', async () => { // Update at 00:00:01 every day.
        console.log("Updating...");
        await serversConfig.manage(true);
        console.log("Update finished.");
    }).start();
    console.log("Hao bot is ready!!");
    console.log("Press Ctrl+c to destroy a bot.");
});

client.on('messageCreate', async (message) => {
    try {
        await (
            /**
             * @returns {Promise<discord.Message>}
             */
            async () => {
                if (message.author.id === client.user.id) return message;
                if (!message.content.startsWith(Config.getPrefix())) return message;
                let args = message.content.slice(Config.getPrefix().length).split(' ');
                let command = args.shift().toLowerCase();
                if (!client_commands.has(command)) return message;
                console.log(`${message.guild.name}/${message.channel.name} running command ${command} ${args}.`);
                return (await client_commands.get(command).execute(message, args)) ?? message;
            }
        )();
        // after message(a) >>
    } catch (e) {
        console.warn('มีบางอย่างผิดพลาดใน ' + message.guild.name + e.message ? ` : ${e.message}` : JSON.stringify(e));
    }
});

client.login(token);