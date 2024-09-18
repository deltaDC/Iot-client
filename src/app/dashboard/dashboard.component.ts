import { Component } from '@angular/core';
import { Sensor } from '../types/sensor.type';
import { CardComponent } from "./card/card.component";
import { DeviceControlComponent } from "./device-control/device-control.component";
import { Device } from '../types/device.type';
import { ChartComponent } from "./chart/chart.component";
import { DataService } from '../service/data.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CardComponent, DeviceControlComponent, ChartComponent, ButtonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

    sensorDatas: Sensor[] = [];
    deviceDatas: Device[] = [];
    intervalId: any;
    private sensorSubscription: Subscription | undefined;
    private deviceSubscription: Subscription | undefined;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.sensorSubscription = this.dataService.getSensorData().subscribe(data => {
            this.sensorDatas = data;
        });

        this.deviceSubscription = this.dataService.getDeviceData().subscribe(data => {
            this.deviceDatas = data;
        })

        // this.intervalId = setInterval(() => {
        //     this.updateSensorValues();
        // }, 1000);
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

    // updateSensorValues(): void {
    //     this.dataService.updateSensorValues()
    // }

}
