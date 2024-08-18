import { Component, Input } from '@angular/core';
import { Sensor } from '../../types/sensor.type';
import { CommonModule } from '@angular/common';



@Component({
    selector: 'app-card',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './card.component.html',
    styleUrl: './card.component.css'
})
export class CardComponent {
    @Input() data!: Sensor;

    getBackgroundColorClass(): string {
        if (this.data.type === 'temperature') {
            return this.data.value > 20 ? 'bg-red-500' : 'bg-blue-500';
        } else if (this.data.type === 'humidity') {
            return this.data.value > 70 ? 'bg-green-500' : 'bg-yellow-500';
        } else if (this.data.type === 'brightness') {
            return this.data.value > 500 ? 'bg-purple-500' : 'bg-gray-500';
        }
        return 'bg-white';
    }
}
