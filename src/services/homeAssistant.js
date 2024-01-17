import axios from 'axios';
import { hexToRgb } from '../utils/colorUtils';

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const HOME_ASSISTANT_URL = process.env.HOME_ASSISTANT_URL;

export async function controlEntity(entityID, hexColor) {
    try {

        const rgbColor = hexToRgb(hexColor);

        const data = {
            entity_id: entityID,
            rgb_color: rgbColor,
        };

        const response = await axios.post(
            `${HOME_ASSISTANT_URL}/api/services/light/turn_on`, data,
            
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("peepohappy");
    } catch (error) {
        console.error("peeposad: ", error);
    }
}
