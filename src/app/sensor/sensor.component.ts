import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { Sensor } from '../types/sensor.type';
import { DataService } from '../service/data.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-sensor',
    standalone: true,
    imports: [
        MatTableModule,
        MatPaginatorModule
    ],
    templateUrl: './sensor.component.html',
    styleUrl: './sensor.component.css'
})
export class SensorComponent {
    constructor(private dataService: DataService) { }

    intervalId: any
    sub: Subscription | undefined;
    sensorData: Sensor[] = [];
    displayedColumns: string[] = ['id', 'name', 'value', 'unit', 'type'];
    dataSource = new MatTableDataSource<Sensor>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void {
        this.dataService.getSensorData().subscribe(newData => {
            // Push new data to the sensorData array
            this.sensorData.push(...newData);

            // Update the dataSource with the new data
            this.dataSource.data = this.sensorData;
        });

        this.intervalId = setInterval(() => {
            this.updateSensorValues();
        }, 1000);
    }

    // ngOnChanges(changes: SimpleChanges): void {
    //     if (changes['sensorData']) {
    //         // Handle changes in sensorData
    //         this.dataSource.data = this.sensorData;
    //         console.log("data changed");
    //     }
    // }

    ngOnDestroy(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    updateSensorValues(): void {
        this.sub = this.dataService.updateSensorValues().subscribe(data => {
            this.sensorData.push(...data);
            this.dataSource.data = this.sensorData;
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
