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
    @Input() datas!: Sensor[] | History[] | any[]
    @Input() totalElements!: number;
    @Input() totalPages!: number;
    columns: any[] = [];
    globalFilterFields: string[] = [];

    rows: number = 10;

    @ViewChild(Table) table: Table | undefined;

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.columns = ["Id", "Temperature", "Humidity", "Brightness", "CreatedAt"]
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['datas'] && changes['datas'].currentValue) {
            // console.log('Received sensor data in child component:', this.datas);
        }

        if (changes['totalElements'] && changes['totalElements'].currentValue) {
            // console.log('Total element from child ', this.totalElements);
        }
    }

    ngAfterViewInit() {
        // console.log('Total pages:', this.getTotalPages());
    }

    applyFilterGlobal($event: any, stringVal: any) {
        this.table!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    getRowDataValue(column: string, rowData: any): any {
        const lowerCaseColumn = column.toLowerCase();
        if (lowerCaseColumn === 'id') {
            return rowData[lowerCaseColumn];
        } else if (rowData.data && rowData.data[lowerCaseColumn]) {
            return `${rowData.data[lowerCaseColumn].value} ${rowData.data[lowerCaseColumn].unit}`;
        } else if (lowerCaseColumn === 'createdat') {
            return rowData["createdAt"];
        }
        return null;
    }

    onFilterChange(event: any, column: string): void {
        console.log("triggered filter change");
        const filterValue = event.target.value;
        console.log('Filter value:', filterValue);

        // Adjust the column name if it is 'createdat'
        const adjustedColumn = column.toLowerCase() === 'createdat' ? 'createdAt' : column.toLowerCase();
        const params = { [adjustedColumn]: filterValue };

        this.dataService.getSensorData(params).subscribe((response: BaseResponse) => {
            console.log("Filtered data:", response);
            this.datas = response.response.content.map((item: any) => ({
                id: item.id,
                createdAt: item.createdAt,
                data: JSON.parse(item.data),
                icon: item.icon
            }));
        });
    }

    onSort(event: any): void {
        const sortField = event.field;
        const sortOrder = event.order === 1 ? 'ASC' : 'DESC';
        console.log('Sort field:', sortField);
        console.log('Sort order:', sortOrder);

        // Adjust the column name if it is 'createdat'
        const adjustedSortField = sortField.toLowerCase() === 'createdat' ? 'createdAt' : sortField.toLowerCase();
        const params = { sortBy: adjustedSortField, sortDirection: sortOrder };

        this.dataService.getSensorData(params).subscribe((response: BaseResponse) => {
            console.log("Sorted data:", response);
            this.datas = response.response.content.map((item: any) => ({
                id: item.id,
                createdAt: item.createdAt,
                data: JSON.parse(item.data),
                icon: item.icon
            }));
        });
    }

    getTotalPages(): number {
        if (this.table) {
            const totalRecords = this.table.totalRecords;
            const rows = this.table.rows;
            if (rows === undefined) return 0
            return Math.ceil(totalRecords / rows);
        }
        return 0;
    }

    loadData(event: any): void {
        console.log("loadData run")
        const page = event.first / event.rows;
        const pageSize = event.rows;
        this.rows = event.rows;
        const sortField = event.sortField || '';
        const sortOrder = event.sortOrder === 1 ? 'ASC' : 'DESC';

        const params = {
            page: page,
            pageSize: pageSize,
            sortBy: sortField,
            sortDirection: sortOrder
        };

        console.log(params);

        this.dataService.getSensorData(params).subscribe((response: BaseResponse) => {
            console.log("Paged data:", response);
            this.datas = response.response.content.map((item: any) => ({
                id: item.id,
                createdAt: item.createdAt,
                data: JSON.parse(item.data),
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
}
