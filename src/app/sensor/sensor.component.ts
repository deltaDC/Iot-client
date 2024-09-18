import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { Sensor } from '../types/sensor.type';
import { DataService } from '../service/data.service';
import { Subscription } from 'rxjs';
import { FilterComponent } from "../common/filter/filter.component";
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from "../common/data-table/data-table.component";


@Component({
    selector: 'app-sensor',
    standalone: true,
    imports: [
        FilterComponent,
        TableModule,
        CommonModule,
        DataTableComponent
    ],
    templateUrl: './sensor.component.html',
    styleUrl: './sensor.component.css'
})
export class SensorComponent {
    constructor(private dataService: DataService) { }

    intervalId: any
    sub: Subscription | undefined;
    sensorData: Sensor[] = [];

    ngOnInit(): void {
        this.dataService.getSensorData().subscribe(newData => {
            if (this.sensorData.length < 20) this.sensorData.push(...newData);
        });

        // this.intervalId = setInterval(() => {
        //     this.updateSensorValues();
        // }, 1000);

    }

    ngOnDestroy(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    // updateSensorValues(): void {
    //     this.dataService.updateSensorValues()
    // }
}
