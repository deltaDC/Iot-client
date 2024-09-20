import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { Sensor } from '../types/sensor.type';
import { DataService } from '../service/data.service';
import { Subscription } from 'rxjs';
import { FilterComponent } from "../common/filter/filter.component";
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from "../common/data-table/data-table.component";
import { SensorTableComponent } from "./sensor-table/sensor-table.component";


@Component({
    selector: 'app-sensor',
    standalone: true,
    imports: [
        FilterComponent,
        TableModule,
        CommonModule,
        DataTableComponent,
        SensorTableComponent
    ],
    templateUrl: './sensor.component.html',
    styleUrl: './sensor.component.css'
})
export class SensorComponent {

    constructor(private dataService: DataService) { }

    sub: Subscription | undefined;
    sensorData: Sensor[] = [];
    totalElements: number = 0;
    totalPages: number = 0;

    ngOnInit(): void {
        this.sub = this.dataService.getSensorData().subscribe(newData => {
            console.log('Received Sensor Data:', newData.response);
            this.totalElements = newData.response.totalElements;
            this.totalPages = newData.response.totalPages;
            this.sensorData = newData.response.content.map((item: any) => ({
                id: item.id,
                createdAt: item.createdAt,
                data: JSON.parse(item.data),
                icon: item.icon
            }));

            console.log('Parsed Sensor Data:', this.sensorData);
        });
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}