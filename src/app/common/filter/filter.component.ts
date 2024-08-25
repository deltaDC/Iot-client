import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-filter',
    standalone: true,
    imports: [
        FormsModule,
        InputIconModule,
        IconFieldModule,
        InputTextModule,
        DropdownModule
    ],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.css'
})
export class FilterComponent {
    @Input() uniqueUnits: any[] = [];
    @Input() uniqueTypes: any[] = [];
    @Output() filterChange = new EventEmitter<{ unit: string, type: string, search: string }>();

    filterValues = {
        unit: '',
        type: '',
        search: ''
    };

    ngOnInit() {
        this.uniqueUnits = this.uniqueUnits.map((unit: any) => {
            return { name: unit };
        });

        this.uniqueTypes = this.uniqueTypes.map((unit: any) => {
            return { name: unit };
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.filterValues.search = filterValue.trim().toLowerCase();
        this.filterChange.emit(this.filterValues);
    }

    applyUnitFilter(event: any) {
        console.log("event")
        const filterValue = event.value?.name;
        this.filterValues.unit = filterValue;
        this.filterChange.emit(this.filterValues);
    }

    applyTypeFilter(event: any) {
        const filterValue = event.value?.name;
        this.filterValues.type = filterValue;
        this.filterChange.emit(this.filterValues);
    }

    isStringArray(arr: any[]): boolean {
        return arr.length > 0 && typeof arr[0] === 'string';
    }
}
