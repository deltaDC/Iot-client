import { Component, Input } from '@angular/core';
import { Sensor } from '../../types/sensor.type';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestion, faTemperatureThreeQuarters } from '@fortawesome/free-solid-svg-icons';
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

    ngOnInit() {
        console.log("Card data from father is", this.data)
    }

    ngOnChanges() {
        console.log("Card data from father is", this.data)
    }

    tempIcon = faTemperatureThreeQuarters;
    humidityIcon = faDroplet;
    brightnessIcon = faSun;
    questionIcon = faQuestion;

    // getIconColor(name: string, value: number): string {
    //     switch (name) {
    //         case 'temperature':
    //             return value < 20 ? 'text-blue-500' : value < 30 ? 'text-orange-500' : 'text-red-500';
    //         case 'humidity':
    //             return value < 30 ? 'text-gray-500' : value < 70 ? 'text-blue-500' : 'text-blue-700';
    //         case 'brightness':
    //             return value < 100 ? 'text-gray-700' : value < 500 ? 'text-gray-500' : 'text-yellow-500';
    //         default:
    //             return 'text-gray-500';
    //     }
    // }

    getBackgroundColor(name: string, value: number): string {
        switch (name) {
            case 'temperature':
                if (value < 10) return '#1E3A8A';
                if (value < 15) return '#1D4ED8';
                if (value < 20) return '#3B82F6';
                if (value < 25) return '#FDBA74';
                if (value < 30) return '#F97316';
                if (value < 35) return '#FCA5A5';
                if (value < 40) return '#EF4444';
                return '#B91C1C';

            case 'humidity':
                if (value < 10) return '#111827';
                if (value < 20) return '#374151';
                if (value < 30) return '#6B7280';
                if (value < 40) return '#93C5FD';
                if (value < 50) return '#3B82F6';
                if (value < 60) return '#1D4ED8';
                if (value < 70) return '#1E3A8A';
                if (value < 80) return '#1D4ED8';
                if (value < 90) return '#3B82F6';
                return '#93C5FD';

            case 'brightness':
                if (value < 50) return '#B45309'; // Darker yellow
                if (value < 100) return '#D97706'; // Dark yellow
                if (value < 200) return '#F59E0B'; // Yellow
                if (value < 300) return '#FBBF24'; // Light yellow
                if (value < 400) return '#FDE68A'; // Lighter yellow
                if (value < 500) return '#FEF3C7'; // Very light yellow
                if (value < 600) return '#FFFBEB'; // Almost white yellow
                if (value < 700) return '#FEF3C7'; // Very light yellow
                if (value < 800) return '#FDE68A'; // Lighter yellow
                return '#FBBF24'; // Light yellow

            case 'someData':
                if (value <= 80) return '#0ffc03'
                else if (value > 80) return "#fc0f03"
                return "#fcd703"

            default:
                return 'bg-gray-500';
        }
    }

}
