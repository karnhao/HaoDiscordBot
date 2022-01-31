import { Message } from "discord.js";
import { client } from "../main.js";
import { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } from "@discordjs/voice";

export const name = 'ps';
export const description = 'เล่นเสียง';

/**
 * 
 * @param {Message} message 
 * @param {String[]} args 
 */
export async function execute(message, args) {
    let wait
    try {
        console.log("DEBUG : START EXECUTE PLAYSOUND.");
        await message.fetch();
        await message.delete();
        let vc = message.member.voice.channel;
        wait = await message.channel.send({ content: "กรุณารอ..." });
        if (!vc || !vc.isVoice()) throw new Error("ไม่พบห้องพูดคุย");
        let permission = vc.permissionsFor(client.user);
        if (!permission.has("CONNECT")) throw new Error("ไม่มีสิทธิในการเข้าห้องนั้น");
        if (!permission.has("SPEAK")) throw new Error("ไม่มีสิทธิในการพูดในห้องนั้น");
        if (message.attachments?.first()?.url == null) throw new Error("ไม่มีข้อมูล");
        let player = createAudioPlayer();
        let resourse = createAudioResource(message.attachments.first().url);
        let connection = joinVoiceChannel({
            channelId: vc.id,
            guildId: message.guildId,
            adapterCreator: message.guild.voiceAdapterCreator
        });
        connection.subscribe(player);
        player.play(resourse);
        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });
        await message.channel.send({ content: "กำลังเล่นเพลง " + message.attachments.first().name });
    } catch (e) {
        await message.channel.send({ content: "❌มีบางอย่างผิดพลาด " + e });
    } finally {
        if (wait.deletable) await wait.delete();
    }
}