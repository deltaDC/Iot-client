import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DataService } from '../service/data.service';
import { History } from '../types/history.type';
import { FilterComponent } from "../common/filter/filter.component";

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [
        MatTableModule,
        MatPaginatorModule,
        FilterComponent
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
    filterValues = {
        value: '',
        type: '',
        search: ''
    };

    uniqueValues: boolean[] = [];
    uniqueTypes: string[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void {
        this.dataService.getHistoryData().subscribe(data => {
            this.historyData = data;
            this.dataSource.data = this.historyData;
            this.uniqueValues = [...new Set(this.historyData.map(item => item.value))];
            this.uniqueTypes = [...new Set(this.historyData.map(item => item.type))];
        });

        this.dataSource.filterPredicate = this.createFilter();
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    onFilterChange(filterValues: { unit: string, type: string, search: string }) {
        this.dataSource.filter = JSON.stringify(filterValues);
    }

    createFilter(): (data: History, filter: string) => boolean {
        return (data: History, filter: string): boolean => {
            const searchTerms = JSON.parse(filter);
            const isSearchMatch = data.name.toLowerCase().includes(searchTerms.search) ||
                data.id.toString().includes(searchTerms.search) ||
                data.value.toString().includes(searchTerms.search);
            const isValueMatch = searchTerms.value ? data.value === searchTerms.value : true;
            const isTypeMatch = searchTerms.type ? data.type === searchTerms.type : true;
            return isSearchMatch && isValueMatch && isTypeMatch;
        };
    }
}
