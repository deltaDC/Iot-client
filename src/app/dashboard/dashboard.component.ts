import { Component } from '@angular/core';
import { Sensor } from '../types/sensor.type';
import { CardComponent } from "./card/card.component";
import { DeviceControlComponent } from "./device-control/device-control.component";
import { Device } from '../types/device.type';
import { ChartComponent } from "./chart/chart.component";
import { DataService } from '../service/data.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { WebSocketService } from '../service/websocket.service';
// import { WebSocketService } from '../service/websocket.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CardComponent, DeviceControlComponent, ChartComponent, ButtonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

    sensorData!: Sensor;
    deviceDatas: Device[] = [];
    intervalId: any;
    private sensorSubscription: Subscription | undefined;
    private deviceSubscription: Subscription | undefined;
    private socketSubcription: Subscription | undefined;

    constructor(private dataService: DataService, private webSocketService: WebSocketService) { }

    ngOnInit(): void {
        this.sensorSubscription = this.dataService.getLatestSensorData().subscribe(data => {
            console.log("data is ", data.response);
            const parseData = {
                id: data.response.id,
                createdAt: data.response.createdAt,
                data: JSON.parse(data.response.data),
                date: data.response.createdAt
            };
            this.sensorData = parseData;
            console.log("sensorData is ", this.sensorData)
        });

        this.deviceSubscription = this.dataService.getDeviceData().subscribe(data => {
            console.log("device data is ", data)
            this.deviceDatas = data.response
            console.log("device data is ", this.deviceDatas)
        })

        this.socketSubcription = this.webSocketService.getSensorUpdates().subscribe(
            data => {
                console.log("--------------------");
                console.log("Sensor data is updated from socket subscription");
                console.log(data);
                const parseData = {
                    id: data.id,
                    createdAt: data.createdAt,
                    data: JSON.parse(data.data),
                    date: data.createdAt
                };
                this.sensorData = parseData;
                console.log("--------------------");
            },
            error => {
                console.error("WebSocket error:", error);
            }
        );

        // this.intervalId = setInterval(() => {
        //     this.updateSensorValues();
        // }, 5000);
    }

    ngOnDestroy(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        if (this.sensorSubscription) {
            this.sensorSubscription.unsubscribe();
        }
        if (this.deviceSubscription) {
            this.deviceSubscription.unsubscribe();
        }
    }

    updateSensorValues() {
        this.dataService.getLatestSensorData().subscribe(data => {
            // this.sensorData = data;
            console.log("data is ", data.response);
            const parseData = {
                id: data.response.id,
                createdAt: data.response.createdAt,
                data: JSON.parse(data.response.data),
                date: data.response.createdAt
            };
            this.sensorData = parseData;
            console.log("sensorData is ", this.sensorData)
        });
    }

}
