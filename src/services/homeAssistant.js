import axios from 'axios';
import { hexToRgb, expandHexColor } from '../utils/colorUtils';

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const HOME_ASSISTANT_URL = process.env.HOME_ASSISTANT_URL;
const HOME_ASSISTANT_DEVICE_LIST = JSON.parse(process.env.HOME_ASSISTANT_DEVICE_LIST)


export async function controlEntity(entityID, hexColor) {
    try {

        const stateResponse = await axios.get(`${HOME_ASSISTANT_URL}/api/states/${entityID}`, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
        });

 
        if (stateResponse.data.state === 'off') {
            throw new Error('esse dispositivo está desligado');
        }

        const rgbColor = hexToRgb(hexColor);
        const data = {
            entity_id: entityID,
            rgb_color: rgbColor,
        };

        await axios.post(`${HOME_ASSISTANT_URL}/api/services/light/turn_on`, data, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
        });
        console.log("peepohappy");
    } catch (error) {
        console.error("peeposad: ", error);
        throw error; 
    }
}
export async function controlDevice(entityNickname, hexColor) {
    try {
        if (!HOME_ASSISTANT_DEVICE_LIST.hasOwnProperty(entityNickname)) {
            throw new Error("esse dispositivo não existe.");
        }
        const color = expandHexColor(hexColor);
        await controlEntity(HOME_ASSISTANT_DEVICE_LIST[entityNickname], color); 
    } catch (error) {
        console.error("Dispositivo ou cor inválida.");
        throw error;
    }
}




