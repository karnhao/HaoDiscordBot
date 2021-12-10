import { playsound } from "./commands.js";

export const name = "ps";
export const description = "เล่นเสียง";
export async function execute(message, args) {
    await playsound.execute(message, args);
}