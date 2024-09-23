import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { DataService } from '../../service/data.service';
import { BaseResponse } from '../../types/baseresponse.type';
import { History } from '../../types/history.type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
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
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-history-table',
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
    templateUrl: './history-table.component.html',
    styleUrl: './history-table.component.css',
    providers: [MessageService, ConfirmationService]
})
export class HistoryTableComponent {
    @Input() datas!: History[]
    @Input() totalElements!: number;
    @Input() totalPages!: number;
    columns: any[] = [];
    globalFilterFields: string[] = [];

    params: any = {}

    rows: number = 10;

    @ViewChild(Table) table: Table | undefined;

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.columns = ["Id", "Device Name", "Status", "CreatedAt"]
        this.globalFilterFields = [...this.columns];
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['datas'] && changes['datas'].currentValue) {
            // console.log('Received sensor data in child component:', this.datas);
        }

        if (changes['totalElements'] && changes['totalElements'].currentValue) {
            // console.log('Total element from child ', this.totalElements);
        }

        // if (changes['filteredColumns'] && changes['filteredColumns'].currentValue) {
        //     console.log('Filter column', this.filteredColumns);
        // }
    }

    applyFilterGlobal($event: any, stringVal: any) {
        this.table!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    getRowDataValue(column: string, rowData: any): any {
        const lowerCaseColumn = column.toLowerCase();
        switch (lowerCaseColumn) {
            case 'id':
                return rowData.id;
            case 'device name':
                return rowData.deviceName;
            case 'status':
                return rowData.status;
            case 'createdat':
                return rowData.createdAt;
            default:
                return null
        }
    }

    onFilterChange(event: any, column: string): void {
        console.log("triggered filter change");
        const filterValue = event.target.value;
        console.log('Filter value:', filterValue);
        console.log('Column:', column);

        // Adjust the column name if it is 'createdat'
        let adjustedColumn = column.toLowerCase() === 'createdat' ? 'createdAt' : column.toLowerCase();
        if (column === 'Device Name') adjustedColumn = "deviceName"
        if (column === 'Status') adjustedColumn = "status"

        // const params = { [adjustedColumn]: filterValue };
        this.params[adjustedColumn] = filterValue;
        if (this.params["page"]) {
            this.params["page"] = 0
            this.table!.first = 0;
        }
        console.log("params is:", this.params)

        this.dataService.getHistoryData(this.params).subscribe((response: BaseResponse) => {
            console.log("Filtered data:", response);
            this.datas = response.response.content
            this.totalElements = response.response.totalElements;
        });
    }

    loadData(event: any): void {
        console.log("loadData run")
        const page = event.first / event.rows;
        const pageSize = event.rows;
        this.rows = event.rows;
        let sortField = event.sortField || '';
        if (sortField === "Device Name") sortField = "deviceName"
        const sortOrder = event.sortOrder === 1 ? 'ASC' : 'DESC';

        this.params["page"] = page
        this.params['size'] = pageSize
        this.params["sortBy"] = sortField
        this.params["sortDirection"] = sortOrder

        this.dataService.getHistoryData(this.params).subscribe((response: BaseResponse) => {
            console.log("Paged data:", response);
            this.datas = response.response.content
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
