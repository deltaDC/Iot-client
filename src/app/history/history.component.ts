import { Component } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { DataService } from '../service/data.service';
import { History } from '../types/history.type';
import { FilterComponent } from "../common/filter/filter.component";
import { DataTableComponent } from "../common/data-table/data-table.component";
import { HistoryTableComponent } from "./history-table/history-table.component";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [
        MatTableModule,
        MatPaginatorModule,
        FilterComponent,
        DataTableComponent,
        HistoryTableComponent
    ],
    templateUrl: './history.component.html',
    styleUrl: './history.component.css'
})
export class HistoryComponent {
    constructor(private dataService: DataService) { }

    historyData: History[] = [];
    sub: Subscription | undefined;
    totalElements: number = 0;
    totalPages: number = 0;

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        this.sub = this.dataService.getHistoryData().subscribe(newData => {
            console.log('Received History Data:', newData.response);
            this.totalElements = newData.response.totalElements;
            this.totalPages = newData.response.totalPages;
            this.historyData = newData.response.content
            console.log('Parsed History Data:', this.historyData);
        });
    }

    formatDate(date: Date): string {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');

        return `${yyyy}/${mm}/${dd} ${hh}:${min}:${ss}`;
    }
}
