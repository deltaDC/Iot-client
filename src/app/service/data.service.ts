import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Device } from '../types/device.type';
import { Sensor } from '../types/sensor.type';
import { History } from '../types/history.type';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    private sensorData: Sensor[] = [
        {
            id: 1,
            name: 'Temperature Sensor',
            value: 22,
            unit: 'Celsius',
            type: 'temperature'
        },
        {
            id: 2,
            name: 'Humidity Sensor',
            value: 45,
            unit: 'Percentage',
            type: 'humidity'
        },
        {
            id: 3,
            name: 'Brightness Sensor',
            value: 300,
            unit: 'Lux',
            type: 'brightness'
        }
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

    getSensorData(): Observable<Sensor[]> {
        return of(this.sensorData);
    }

    getDeviceData(): Observable<Device[]> {
        return of(this.deviceData);
    }

    getHistoryData(): Observable<History[]> {
        return of(this.historyData);
    }

    getRandomValue(type: string): number {
        switch (type) {
            case 'temperature':
                return Math.floor(Math.random() * 35);
            case 'humidity':
                return Math.floor(Math.random() * 100);
            case 'brightness':
                return Math.floor(Math.random() * 500);
            default:
                return 0;
        }
    }

    updateSensorValues(): Observable<Sensor[]> {
        this.sensorData = this.sensorData.map(sensor => ({
            ...sensor,
            value: this.getRandomValue(sensor.type)
        }));
        return of(this.sensorData);
    }
}
