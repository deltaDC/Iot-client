import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Device } from '../types/device.type';
import { Sensor } from '../types/sensor.type';
import { History } from '../types/history.type';
import { Data } from '../types/sensor-data.type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONFIG } from '../../api/api.config';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    baseUrl: string = API_CONFIG.BASE_URL;

    constructor(private http: HttpClient) { }

    private sensorData: Sensor[] = [
        {
            id: 1,
            name: 'Led Switch 1',
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
            },
            date: "2024/01/01 12:00:00"
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
            name: 'Led Switch 1',
            status: "ON",
            date: new Date('2024/01/01 12:00:00')
        },
        {
            id: 2,
            name: 'Led Switch 1',
            status: "ON",
            date: new Date('2023/02/01 13:00:00')
        },
        {
            id: 3,
            name: 'Led Switch 1',
            status: "ON",
            date: new Date('2022/03/01 14:00:00')
        },
        {
            id: 4,
            name: 'Led Switch 1',
            status: "OFF",
            date: new Date('2021/04/01 15:00:00')
        },
        {
            id: 5,
            name: 'Led Switch 1',
            status: "ON",
            date: new Date('2020/05/01 16:00:00')
        },
        {
            id: 6,
            name: 'Led Switch 1',
            status: "OFF",
            date: new Date('2019/06/01 17:00:00')
        },
        {
            id: 7,
            name: 'Led Switch 1',
            status: "ON",
            date: new Date('2018/07/01 18:00:00')
        },
        {
            id: 8,
            name: 'Led Switch 1',
            status: "OFF",
            date: new Date('2017/08/01 19:00:00')
        },
        {
            id: 9,
            name: 'Led Switch 1',
            status: "ON",
            date: new Date('2016/09/01 20:00:00')
        },
        {
            id: 10,
            name: 'Led Switch 10',
            status: "OFF",
            date: new Date('2015/10/01 21:00:00')
        },
        {
            id: 11,
            name: 'Led Switch 11',
            status: "ON",
            date: new Date('2014/11/01 22:00:00')
        },
        {
            id: 12,
            name: 'Led Switch 12',
            status: "OFF",
            date: new Date('2013/12/01 23:00:00')
        }
    ];

    private sensorDataSubject = new BehaviorSubject<Sensor[]>(this.sensorData);
    private deviceDataSubject = new BehaviorSubject<Device[]>(this.deviceData);
    private historyDataSubject = new BehaviorSubject<History[]>(this.historyData);

    getSensorData(params: { [key: string]: string | number }) {
        let httpParams = new HttpParams();
        Object.keys(params).forEach(key => {
            httpParams = httpParams.set(key, params[key].toString());
        });

        return this.http.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SENSORS}`, { params: httpParams });
    }

    getDeviceData(): Observable<Device[]> {
        return this.deviceDataSubject.asObservable();
    }

    getHistoryData(): Observable<History[]> {
        return this.historyDataSubject.asObservable();
    }

    // getRandomValue(name: string): Data {
    //     switch (name) {
    //         case 'temperature':
    //             return { value: Math.floor(Math.random() * 35), unit: 'Celsius' };
    //         case 'humidity':
    //             return { value: Math.floor(Math.random() * 100), unit: 'Percentage' };
    //         case 'brightness':
    //             return { value: Math.floor(Math.random() * 500), unit: 'Lux' };
    //         default:
    //             return { value: 0, unit: '' };
    //     }
    // }

    // updateSensorValues(): void {
    //     this.sensorData = this.sensorData.map(sensor => ({
    //         ...sensor,
    //         data: {
    //             temperature: this.getRandomValue('temperature'),
    //             humidity: this.getRandomValue('humidity'),
    //             brightness: this.getRandomValue('brightness'),
    //         },
    //         id: Math.floor(Math.random() * (100 - 4 + 1)) + 4
    //     }));
    //     this.sensorDataSubject.next(this.sensorData);
    // }
}
