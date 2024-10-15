import { ChangeDetectorRef, Component } from '@angular/core';
import { Sensor } from '../types/sensor.type';
import { CardComponent } from "./card/card.component";
import { DeviceControlComponent } from "./device-control/device-control.component";
import { Device } from '../types/device.type';
import { ChartComponent } from "./chart/chart.component";
import { DataService } from '../service/data.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { WebSocketService } from '../service/websocket.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CardComponent,
        DeviceControlComponent,
        ChartComponent,
        ButtonModule,
        ToastModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    providers: [MessageService]
})
export class DashboardComponent {

    sensorData!: Sensor;
    deviceDatas: Device[] = [];
    isAlert = false;
    isToast = false;
    warningCnt = 0;

    private sensorSubscription: Subscription | undefined;
    private deviceSubscription: Subscription | undefined;
    private socketSubcription: Subscription | undefined;

    constructor(
        private dataService: DataService,
        private webSocketService: WebSocketService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.dataService.getWarningCnt().subscribe(data => {
            this.warningCnt = data.response;
        })

        this.sensorSubscription = this.dataService.getLatestSensorData().subscribe(data => {
            console.log("data is ", data.response);
            const parseData = {
                id: data.response.id,
                createdAt: data.response.createdAt,
                data: JSON.parse(data.response.data),
                date: data.response.createdAt,
                weather: data.response.weather
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
                    date: data.createdAt,
                    weather: data.weather
                };
                this.sensorData = parseData;
                const wind = this.sensorData.data?.wind?.value ?? 0;

                if (wind > 80 && this.isAlert === false && this.isToast === false) {
                    this.messageService.add({ severity: 'warn', summary: 'High wind', detail: `wind is ${wind}`, sticky: true });
                    this.isToast = true;
                    this.dataService.blinkDevice("LED BLINK").subscribe(data => {
                        console.log("LED BLINK")
                        console.log(data)
                        console.log(data.response)
                        if (data.response === "LED BLINK") {
                            this.isAlert = true;
                        }
                    })

                    this.dataService.getWarningCnt().subscribe(data => {
                        this.warningCnt = data.response;
                    })
                }
                console.log("--------------------");
            },
            error => {
                console.error("WebSocket error:", error);
            }
        );
    }

    onAlertClose() {
        console.log("alert close");
        this.isToast = false;
        if (this.isAlert === true) {
            this.dataService.blinkDevice("LED NOT BLINK").subscribe(data => {
                console.log("LED NOT BLINK")
                console.log(data)
                if (data.response === "LED NOT BLINK") {
                    this.isAlert = false;
                }
            })
        }
    }

    ngOnDestroy(): void {
        if (this.sensorSubscription) {
            this.sensorSubscription.unsubscribe();
        }
        if (this.deviceSubscription) {
            this.deviceSubscription.unsubscribe();
        }
        if (this.socketSubcription) {
            this.socketSubcription.unsubscribe();
        }
    }
}
