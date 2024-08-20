import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-filter',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatInputModule
    ],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.css'
})
export class FilterComponent {
    @Input() uniqueUnits: string[] | boolean[] = [];
    @Input() uniqueTypes: string[] = [];
    @Output() filterChange = new EventEmitter<{ unit: string, type: string, search: string }>();

    filterValues = {
        unit: '',
        type: '',
        search: ''
    };

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.filterValues.search = filterValue.trim().toLowerCase();
        this.filterChange.emit(this.filterValues);
    }

    applyUnitFilter(event: any) {
        const filterValue = event.value;
        this.filterValues.unit = filterValue;
        this.filterChange.emit(this.filterValues);
    }

    applyTypeFilter(event: any) {
        const filterValue = event.value;
        this.filterValues.type = filterValue;
        this.filterChange.emit(this.filterValues);
    }

    isStringArray(arr: any[]): boolean {
        return arr.length > 0 && typeof arr[0] === 'string';
    }
}
