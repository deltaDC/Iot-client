import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DataService } from '../service/data.service';
import { History } from '../types/history.type';

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [
        MatTableModule,
        MatPaginatorModule
    ],
    templateUrl: './history.component.html',
    styleUrl: './history.component.css'
})
export class HistoryComponent {
    constructor(private dataService: DataService) { }

    sub: Subscription | undefined;
    historyData: History[] = [];
    displayedColumns: string[] = ['id', 'name', 'type', 'value', 'date'];
    dataSource = new MatTableDataSource<History>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void {
        this.dataService.getHistoryData().subscribe(data => {
            this.historyData = data;
            this.dataSource.data = this.historyData;
        });
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
