import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Device } from '../types/device.type';
import { Sensor } from '../types/sensor.type';
import { History } from '../types/history.type';
import { Data } from '../types/sensor-data.type';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    private sensorData: Sensor[] = [
        {
            id: 1,
            name: 'sensor data 1',
            data: {
                temperature: {
                    value: 22,
                    unit: 'Celsius',
                },
                humidity: {
                    value: 45,
                    unit: 'Percentage',
                },
                brightness: {
                    value: 300,
                    unit: 'Lux',
                }
            }
        }
        // {
        //     id: 2,
        //     name: 'sensor data 2',
        //     data: {
        //         temperature: {
        //             value: 23,
        //             unit: 'Celsius',
        //         },
        //         humidity: {
        //             value: 50,
        //             unit: 'Percentage',
        //         },
        //         brightness: {
        //             value: 350,
        //             unit: 'Lux',
        //         }
        //     }
        // },
        // {
        //     id: 3,
        //     name: 'sensor data 3',
        //     data: {
        //         temperature: {
        //             value: 32,
        //             unit: 'Celsius',
        //         },
        //         humidity: {
        //             value: 80,
        //             unit: 'Percentage',
        //         },
        //         brightness: {
        //             value: 450,
        //             unit: 'Lux',
        //         }
        //     }
        // }
    ];

    private deviceData: Device[] = [
        {
            id: 1,
            name: 'Led Switch 1',
            status: 'OFF'
        },
        {
            id: 2,
            name: 'Led Switch 2',
            status: 'OFF'
        },
        {
            id: 3,
            name: 'Led Switch 3',
            status: 'OFF'
        }
    ];

    private historyData: History[] = [
        {
            id: 1,
            name: 'Temperature Sensor',
            type: 'temperature',
            value: true,
            date: new Date()
        },
        {
            id: 2,
            name: 'Humidity Sensor',
            type: 'humidity',
            value: true,
            date: new Date()
        },
        {
            id: 3,
            name: 'Brightness Sensor',
            type: 'brightness',
            value: true,
            date: new Date()
        }
    ];

    private sensorDataSubject = new BehaviorSubject<Sensor[]>(this.sensorData);
    private deviceDataSubject = new BehaviorSubject<Device[]>(this.deviceData);
    private historyDataSubject = new BehaviorSubject<History[]>(this.historyData);

    getSensorData(): Observable<Sensor[]> {
        return this.sensorDataSubject.asObservable();
    }

    getDeviceData(): Observable<Device[]> {
        return this.deviceDataSubject.asObservable();
    }

    getHistoryData(): Observable<History[]> {
        return this.historyDataSubject.asObservable();
    }

    getRandomValue(name: string): Data {
        switch (name) {
            case 'temperature':
                return { value: Math.floor(Math.random() * 35), unit: 'Celsius' };
            case 'humidity':
                return { value: Math.floor(Math.random() * 100), unit: 'Percentage' };
            case 'brightness':
                return { value: Math.floor(Math.random() * 500), unit: 'Lux' };
            default:
                return { value: 0, unit: '' };
        }
    }

    updateSensorValues(): void {
        this.sensorData = this.sensorData.map(sensor => ({
            ...sensor,
            data: {
                temperature: this.getRandomValue('temperature'),
                humidity: this.getRandomValue('humidity'),
                brightness: this.getRandomValue('brightness'),
            },
            id: Math.floor(Math.random() * (100 - 4 + 1)) + 4
        }));
        this.sensorDataSubject.next(this.sensorData);
    }
}
