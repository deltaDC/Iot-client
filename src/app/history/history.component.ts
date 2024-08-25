import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DataService } from '../service/data.service';
import { History } from '../types/history.type';
import { FilterComponent } from "../common/filter/filter.component";
import { DataTableComponent } from "../common/data-table/data-table.component";

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [
        MatTableModule,
        MatPaginatorModule,
        FilterComponent,
        DataTableComponent
    ],
    templateUrl: './history.component.html',
    styleUrl: './history.component.css'
})
export class HistoryComponent {
    constructor(private dataService: DataService) { }

    historyData: History[] = [];
    // displayedColumns: string[] = ['id', 'name', 'type', 'value', 'date'];
    // dataSource = new MatTableDataSource<History>();

    uniqueValues: boolean[] = [];
    uniqueTypes: string[] = [];

    // @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit() {
        // this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void {
        this.dataService.getHistoryData().subscribe(data => {
            this.historyData = data;
            // this.dataSource.data = this.historyData;
            this.uniqueValues = [...new Set(this.historyData.map(item => item.value))];
            this.uniqueTypes = [...new Set(this.historyData.map(item => item.type))];
        });
    }
}
