import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { Sensor } from '../types/sensor.type';
import { DataService } from '../service/data.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { FilterComponent } from "../common/filter/filter.component";


@Component({
    selector: 'app-sensor',
    standalone: true,
    imports: [
        MatTableModule,
        MatPaginatorModule,
        FilterComponent
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

    uniqueUnits: string[] = [];
    uniqueTypes: string[] = [];

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

            this.uniqueUnits = [...new Set(this.sensorData.map(item => item.unit))];
            this.uniqueTypes = [...new Set(this.sensorData.map(item => item.type))];
        });

        this.intervalId = setInterval(() => {
            this.updateSensorValues();
        }, 1000);

        this.dataSource.filterPredicate = this.createFilter();
    }

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

    onFilterChange(filterValues: { unit: string, type: string, search: string }) {
        this.dataSource.filter = JSON.stringify(filterValues);
    }

    createFilter(): (data: Sensor, filter: string) => boolean {
        return (data: Sensor, filter: string): boolean => {
            const searchTerms = JSON.parse(filter);
            const isSearchMatch = data.name.toLowerCase().includes(searchTerms.search) ||
                data.id.toString().includes(searchTerms.search) ||
                data.value.toString().includes(searchTerms.search);
            const isUnitMatch = searchTerms.unit ? data.unit === searchTerms.unit : true;
            const isTypeMatch = searchTerms.type ? data.type === searchTerms.type : true;
            return isSearchMatch && isUnitMatch && isTypeMatch;
        };
    }
}
