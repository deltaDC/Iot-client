import { ChangeDetectorRef, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { Sensor } from '../../types/sensor.type';
import { DataService } from '../../service/data.service';

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
    dialog: boolean = false;

    @Input() datas!: Sensor[] | History[] | any[]
    originalDatas: Sensor[] | History[] | any[] = []
    columns: any[] = [];
    globalFilterFields: string[] = [];

    data!: any;

    selectedDatas!: any[] | null;

    submitted: boolean = false;

    @ViewChild(Table) table: Table | undefined;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {

        if (this.datas.length > 0) {
            this.columns = Object.keys(this.datas[0]).map(key => ({ field: key, header: this.capitalizeFirstLetter(key) }));
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

    openNew() {
        this.data = {};
        this.submitted = false;
        this.dialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected datas?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.datas = this.datas.filter((val) => !this.selectedDatas?.includes(val));
                this.selectedDatas = null;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
            }
        });
    }

    editData(data: any) {
        this.data = { ...data };
        this.dialog = true;
    }

    deleteData(data: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + data.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.datas = this.datas.filter((val) => val.id !== data.id);
                this.data = {};
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'any Deleted', life: 3000 });
            }
        });
    }

    hideDialog() {
        this.dialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.data.name?.trim()) {
            if (this.data.id) {
                this.datas[this.findIndexById(this.data.id)] = this.data;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'any Updated', life: 3000 });
            } else {
                this.data.id = this.createId();
                this.data.image = 'data-placeholder.svg';
                this.datas.push(this.data);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'any Created', life: 3000 });
            }

            this.datas = [...this.datas];
            this.dialog = false;
            this.data = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.datas.length; i++) {
            if (this.datas[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
        }
        return 'success';
    }

    getUniqueValues(field: string): any[] {
        const values = this.datas.map(item => item[field]);
        return Array.from(new Set(values)).map(value => ({ label: value, value }));
    }

    getDropdownOptions(field: string) {
        if (field === 'unit' || field === 'type') {
            return this.getUniqueValues(field);
        }
        return [];
    }

    onFilterChange(event: any) {
        console.log("Filter changed");
        console.log("Event:", event);
        console.log("Datas", this.datas)
        console.log("Original Datas", this.originalDatas);

        if (event.value === null || event.value === '') {
            this.datas = [...this.originalDatas];
            return;
        }

        this.datas = this.originalDatas.filter((item: any) =>
            item.unit === event.value || item.type === event.value
        );

        console.log("Filtered Datas:", this.datas);
    }
}
