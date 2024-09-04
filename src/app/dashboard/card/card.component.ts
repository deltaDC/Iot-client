import { Component, Input } from '@angular/core';
import { Sensor } from '../../types/sensor.type';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTemperatureThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        FontAwesomeModule
    ],
    templateUrl: './card.component.html',
    styleUrl: './card.component.css'
})
export class CardComponent {
    @Input() data!: Sensor;

    tempIcon = faTemperatureThreeQuarters;
    humidityIcon = faDroplet;
    brightnessIcon = faSun;

    getIconColor(name: string, value: number): string {
        switch (name) {
            case 'temperature':
                return value < 20 ? 'text-blue-500' : value < 30 ? 'text-yellow-500' : 'text-red-500';
            case 'humidity':
                return value < 30 ? 'text-blue-500' : value < 70 ? 'text-yellow-500' : 'text-red-500';
            case 'brightness':
                return value < 100 ? 'text-blue-500' : value < 300 ? 'text-yellow-500' : 'text-red-500';
            default:
                return 'text-gray-500';
        }
    }

}
