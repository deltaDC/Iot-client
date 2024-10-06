import { Data } from "./sensor-data.type";

export interface Sensor {
    id: number;
    name?: string;
    data: {
        temperature: Data
        humidity: Data
        brightness: Data
        someData?: Data
    },
    date: string
    icon?: string;
}