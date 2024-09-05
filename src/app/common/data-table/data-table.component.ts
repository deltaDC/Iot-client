import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
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
import { DataService } from '../../service/data.service';
import { Sensor } from '../../types/sensor.type';

@Component({
    selector: 'app-data-table',
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
    providers: [MessageService, ConfirmationService],
    templateUrl: './data-table.component.html',
    styleUrl: './data-table.component.css'
})
export class DataTableComponent {
    // dialog: boolean = false;

    @Input() datas!: Sensor[] | History[] | any[]
    originalDatas: Sensor[] | History[] | any[] = []
    columns: any[] = [];
    globalFilterFields: string[] = [];

    @ViewChild(Table) table: Table | undefined;

    constructor() { }

    ngOnInit() {

        if (this.datas.length > 0) {
            this.columns = [];
            Object.keys(this.datas[0]).forEach(key => {
                if (key === 'data') {
                    Object.keys(this.datas[0][key]).forEach(nestedKey => {
                        this.columns.push({ field: `data.${nestedKey}.value`, header: this.capitalizeFirstLetter(nestedKey) });
                    });
                } else {
                    this.columns.push({ field: key, header: this.capitalizeFirstLetter(key) });
                }
            });
            this.globalFilterFields = this.columns.map(column => column.field);
        }
        console.log('Columns:', this.columns);

        setInterval(() => {
            if (this.datas.length > this.originalDatas.length) {
                this.originalDatas = [...this.datas];
                if (this.table) {
                    this.table.reset();
                }
            }
        }, 2000);
    }

    capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    applyFilterGlobal($event: any, stringVal: any) {
        this.table!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    // getUniqueValues(field: string): any[] {
    //     const values = this.datas.map(item => item[field]);
    //     return Array.from(new Set(values)).map(value => ({ label: value, value }));
    // }

    // getDropdownOptions(field: string) {
    //     if (field === 'unit' || field === 'type') {
    //         return this.getUniqueValues(field);
    //     }
    //     return [];
    // }

    // onFilterChange(event: any) {
    //     console.log("Filter changed");
    //     console.log("Event:", event);
    //     console.log("Datas", this.datas)
    //     console.log("Original Datas", this.originalDatas);

    //     if (event.value === null || event.value === '') {
    //         this.datas = [...this.originalDatas];
    //         return;
    //     }

    //     this.datas = this.originalDatas.filter((item: any) =>
    //         item.unit === event.value || item.type === event.value
    //     );

    //     console.log("Filtered Datas:", this.datas);
    // }

    // customSort(event: any) {
    //     console.log("on custom sort");
    //     event.data.sort((data1: any, data2: any) => {
    //         let value1 = this.resolveFieldData(data1, event.field);
    //         let value2 = this.resolveFieldData(data2, event.field);
    //         let result = null;

    //         if (value1 == null && value2 != null)
    //             result = -1;
    //         else if (value1 != null && value2 == null)
    //             result = 1;
    //         else if (value1 == null && value2 == null)
    //             result = 0;
    //         else if (typeof value1 === 'string' && typeof value2 === 'string')
    //             result = value1.localeCompare(value2);
    //         else
    //             result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

    //         return (event.order * result);
    //     });
    // }

    // resolveFieldData(data: any, field: string): any {
    //     if (data && field) {
    //         let fields: string[] = field.split('.');
    //         let value = data;
    //         for (let i = 0; i < fields.length; i++) {
    //             if (value == null) {
    //                 return null;
    //             }
    //             value = value[fields[i]];
    //         }
    //         return value;
    //     } else {
    //         return null;
    //     }
    // }

    getRowDataValue(columnField: any, rowData: string): any {
        if (columnField.includes('.')) {
            const nestedFields = columnField.split('.');
            let value = rowData;
            for (let i = 0; i < nestedFields.length; i++) {
                if (value == null) {
                    return null;
                }
                value = value[nestedFields[i]];
            }
            return value;
        } else {
            return rowData[columnField];
        }
    }
}
