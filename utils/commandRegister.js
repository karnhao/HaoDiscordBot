
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10'
import { client_commands } from '../main.js';

/**
 * 
 * @param {String} token 
 * @param {String} clientId 
 * @param  {...String} guildId 
 */
export async function register(token, clientId) {
    let commands = client_commands.map((t) => new SlashCommandBuilder().setName(t.name).setDescription(t.description).toJSON());
    const rest = new REST({ version: '10' }).setToken(token);
    try {
        await rest.put(Routes.applicationCommands(clientId), { body : commands });
        console.log(JSON.stringify(commands, null, 4));
        console.log(`Successfully registered application commands.`)
    } catch (error) {
        console.error(`failed to register application commands : ${error}`);
    }
}
