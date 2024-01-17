import tmi from "tmi.js";
import { controlDevice } from "./homeAssistant.js";

const USERNAME = process.env.TMI_USERNAME;
const TOKEN = process.env.TMI_TOKEN;
const CHANNELS = process.env.TMI_CHANNELS.split(", ");
const HOME_ASSISTANT_DEVICE_LIST = JSON.parse(process.env.HOME_ASSISTANT_DEVICE_LIST)

const client = new tmi.Client({
    options: {
        debug: true,
    },
    identity: {
        username: USERNAME,
        password: TOKEN,
    },
    channels: CHANNELS,
});

client.connect();

client.on("message", async (channel, tags, message, self) => {
    if (self) return;

    if (message.toLowerCase().startsWith("!controlar")) {
        const args = message.split(" ");
        try {
            await controlDevice(args[1], args[2]);
            client.say(channel, `@${tags.username}, mudando cor de ${args[1]} para ${args[2]}`);
        } catch (error) {
            client.say(channel, `@${tags.username}, peeposad ${error.message}`);
            console.error(error);
        }
    }

    if (message.toLowerCase() === "!dispositivos") {
        const deviceNicknames = Object.keys(HOME_ASSISTANT_DEVICE_LIST);
        const response = deviceNicknames.length > 0 
            ? `peepohappy Dispositivos disponíveis: ${deviceNicknames.join(', ')}`
            : "peeposad Não há dispositivos disponíveis.";

        client.say(channel, `@${tags.username}, ${response}`);
    }
    if (message.toLowerCase() === "!comandos") {
        client.say(channel, `@${tags.username}, !controlar <nome do dispositivo> <hex da cor>, !dispositivos`);
    }
});

export default client;
