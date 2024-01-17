import tmi from "tmi.js";
import { controlDevice } from "./homeAssistant.js";

const USERNAME = process.env.TMI_USERNAME;
const TOKEN = process.env.TMI_TOKEN;
const CHANNELS = process.env.TMI_CHANNELS.split(", ");
const HOME_ASSISTANT_DEVICE_LIST = JSON.parse(process.env.HOME_ASSISTANT_DEVICE_LIST)

const client = new tmi.Client({
    options: {
        debug: false,
    },
    identity: {
        username: USERNAME,
        password: TOKEN,
    },
    channels: CHANNELS,
});

client.connect();

const PREFIX = "!";

const COMMAND_TIMEOUTS = {
    "controlar": 30,
    "dispositivos": 60,
    "comandos": 10
};

let lastCommandTimes = {};

const commands = {
    "controlar": async (channel, tags, args) => {
        if (args.length < 2) {
            client.say(channel, `@${tags.username}, uso correto: !controlar <nome do dispositivo> <ação>`);
            return;
        }

        const deviceName = args[0];
        const action = args[1];

        try {
            await controlDevice(deviceName, action); 
            client.say(channel, `@${tags.username}, cor de ${deviceName} alterada para ${action}.`);
        } catch (error) {
            client.say(channel, `@${tags.username}, erro ao controlar dispositivo: ${error.message}`);
        }
    },
    "dispositivos": (channel, tags) => {
        const deviceNicknames = Object.keys(HOME_ASSISTANT_DEVICE_LIST); 
        const response = deviceNicknames.length > 0 
            ? `Dispositivos disponíveis: ${deviceNicknames.join(', ')}`
            : "Não há dispositivos disponíveis.";

        client.say(channel, `@${tags.username}, ${response}`);
    },
    "comandos": (channel, tags) => {
        client.say(channel, `@${tags.username}, Comandos disponíveis: !controlar <nome do dispositivo> <ação>, !dispositivos`);
    }
};

client.on("message", async (channel, tags, message, self) => {
    if (self || !message.toLowerCase().startsWith(PREFIX)) return;

    const args = message.slice(PREFIX.length).trim().split(" ");
    const commandName = args.shift().toLowerCase();
    const currentTime = new Date().getTime();

    if (lastCommandTimes[commandName] && (currentTime - lastCommandTimes[commandName]) / 1000 < COMMAND_TIMEOUTS[commandName]) {
        client.say(channel, `@${tags.username}, por favor aguarde antes de usar o comando novamente.`);
        return;
    }

    lastCommandTimes[commandName] = currentTime;

    if (commands[commandName]) {
        commands[commandName](channel, tags, args);
    }
});


export default client;
