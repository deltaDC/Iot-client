import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Sensor } from '../../types/sensor.type';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BaseResponse } from '../../types/baseresponse.type';
import { DataService } from '../../service/data.service';
import { WebSocketService } from '../../service/websocket.service';

@Component({
    selector: 'app-sensor-table',
    standalone: true,
    imports: [
        TableModule,
        DialogModule,
        RippleModule,
        ButtonModule,
        ToastModule,
        ToolbarModule,
        ConfirmDialogModule,
        InputTextModule,
        InputTextareaModule,
        CommonModule,
        FileUploadModule,
        DropdownModule,
        TagModule,
        RadioButtonModule,
        RatingModule,
        InputTextModule,
        FormsModule,
        InputNumberModule
    ],
    templateUrl: './sensor-table.component.html',
    styleUrl: './sensor-table.component.css',
    providers: [MessageService, ConfirmationService],
})
export class SensorTableComponent {
    @Input() datas!: Sensor[]
    @Input() totalElements!: number;
    @Input() totalPages!: number;
    columns: any[] = [];
    globalFilterFields: string[] = [];
    filteredColumns = [...this.columns];
    filterOptions = [
        { label: 'All', value: 'all' },
        { label: 'Temperature', value: 'temperature' },
        { label: 'Humidity', value: 'humidity' },
        { label: 'Brightness', value: 'brightness' }
    ];
    selectedFilter = 'all';
    socketSubcription: any
    isOnFiltered: boolean = false;
    params: any = {};

    rows: number = 10;

    @ViewChild(Table) table: Table | undefined;

    constructor(private dataService: DataService, private webSocketService: WebSocketService) { }

    ngOnInit() {
        this.columns = ["Id", "Temperature", "Humidity", "Brightness", "Wind", "Weather", "CreatedAt"]
        // this.columns = ["Id", "Temperature", "Humidity", "Brightness", "Wind", "CreatedAt"]
        this.globalFilterFields = [...this.columns];
        this.filteredColumns = [...this.columns];
        console.log(this.filteredColumns)

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
                if ((this.datas.length === 0
                    || this.datas[this.datas.length - 1].id !== parseData.id)
                    && !this.isOnFiltered
                ) {
                    this.datas = [...this.datas, parseData];
                    this.totalElements += 1
                }
                console.log("--------------------");
            },
            error => {
                console.error("WebSocket error:", error);
            }
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['datas'] && changes['datas'].currentValue) {
            // console.log('Received sensor data in child component:', this.datas);
            if (this.datas.length === 0) {
                this.params = {}
            }
        }

        if (changes['totalElements'] && changes['totalElements'].currentValue) {
            // console.log('Total element from child ', this.totalElements);
        }

        // if (changes['filteredColumns'] && changes['filteredColumns'].currentValue) {
        //     console.log('Filter column', this.filteredColumns);
        // }
    }

    ngOnDestroy(): void {
        if (this.socketSubcription) {
            clearInterval(this.socketSubcription);
        }
    }

    getRowDataValue(column: string, rowData: any): any {
        const lowerCaseColumn = column.toLowerCase();
        if (lowerCaseColumn === 'id') {
            return rowData[lowerCaseColumn];
        } else if (rowData.data && rowData.data[lowerCaseColumn]) {
            // return `${rowData.data[lowerCaseColumn].value} ${rowData.data[lowerCaseColumn].unit}`;
            return `${rowData.data[lowerCaseColumn].value}`;
        } else if (lowerCaseColumn === 'createdat') {
            return rowData["createdAt"];
        } else if (lowerCaseColumn === 'wind') {
            console.log(JSON.stringify(rowData.data[`wind`]))
            if (rowData.data && rowData.data['wind'] && rowData.data['wind'].value !== undefined && rowData.data['wind'].value > 0) {
                return `${rowData.data['wind'].value}`;
            } else {
                return "No data";
            }
        } else if (lowerCaseColumn === 'weather') {
            if (rowData['weather']?.length > 0) {
                return `${rowData['weather']}`;
            } else {
                return "No data";
            }
        }
        return null;
    }

    onFilterChange(event: any, column: string): void {
        console.log("triggered filter change");
        const filterValue = event.target.value;
        if (filterValue.length > 0) {
            this.isOnFiltered = true
            console.log("isOnFilter change")
        } else this.isOnFiltered = false;

        console.log('Filter value:', filterValue);

        const adjustedColumn = column.toLowerCase() === 'createdat' ? 'createdAt' : column.toLowerCase();
        this.params[adjustedColumn] = filterValue;
        if (this.params["page"]) {
            this.params["page"] = 0
            this.table!.first = 0;
        }

        this.dataService.getSensorData(this.params).subscribe((response: BaseResponse) => {
            console.log("Filtered data:", response);
            this.datas = response.response.content.map((item: any) => ({
                id: item.id,
                createdAt: item.createdAt,
                data: JSON.parse(item.data),
                icon: item.icon,
                weather: item.weather
            }));
            this.totalElements = response.response.totalElements;
        });
    }

    loadData(event: any): void {
        console.log("loadData run")
        const page = event.first / event.rows;
        const pageSize = event.rows;
        this.rows = event.rows;
        const sortField = event.sortField || '';
        const sortOrder = event.sortOrder === 1 ? 'ASC' : 'DESC';

        this.params["page"] = page
        this.params['size'] = pageSize
        this.params["sortBy"] = sortField
        this.params["sortDirection"] = sortOrder

        console.log(this.params);

        this.dataService.getSensorData(this.params).subscribe((response: BaseResponse) => {
            console.log("Paged data:", response);
            this.datas = response.response.content.map((item: any) => ({
                id: item.id,
                createdAt: item.createdAt,
                data: JSON.parse(item.data),
                weather: item.weather
            }));
            this.totalElements = response.response.totalElements;
        });
    }

    onPage(event: any): void {
        console.log("onPage run");
        this.rows = event.rows;
        console.log("row after event", this.rows);
        // this.loadData(event);
    }

    onColumnFilterChange(event: any) {
        const filter = event.value;
        if (filter === 'all') {
            this.filteredColumns = [...this.columns];
        } else if (filter === 'temperature') {
            this.filteredColumns = ['id', 'temperature', 'createdat'];
        } else if (filter === 'humidity') {
            this.filteredColumns = ['id', 'humidity', 'createdat'];
        } else if (filter === 'brightness') {
            this.filteredColumns = ['id', 'brightness', 'createdat'];
        }
    }
}
