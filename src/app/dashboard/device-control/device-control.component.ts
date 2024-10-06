import { Component, Input, SimpleChanges } from '@angular/core';
import { Device } from '../../types/device.type';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLightbulb as faLightbulbSolid } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb as faLightbulbRegular } from '@fortawesome/free-regular-svg-icons';
import { DataService } from '../../service/data.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-device-control',
    standalone: true,
    imports: [
        FormsModule,
        ToggleButtonModule,
        FontAwesomeModule,
        CommonModule
    ],
    templateUrl: './device-control.component.html',
    styleUrl: './device-control.component.css'
})
export class DeviceControlComponent {
    @Input() data!: Device;
    @Input() isAlert!: boolean;
    private blinkInterval: any;

    constructor(private dataService: DataService) { }

    checked: boolean = false;
    isLightbulbOn: boolean = false;
    faLightbulb = faLightbulbSolid;
    faLightbulbRegular = faLightbulbRegular;

    ngOnInit() {
        console.log("Device data from father is", this.data)
        this.isLightbulbOn = this.data.status === "ON";
        this.checked = this.data.status === "ON";
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['isAlert']) {
            const currentValue = changes['isAlert'].currentValue;

            if (currentValue === true) {
                console.log("alerting device");
                this.startBlinking();
            } else {
                this.stopBlinking();
            }
        }
    }

    toggleLightbulb() {
        console.log('Lightbulb toggled');
        console.log(this.data)
        const status = !this.isLightbulbOn;
        console.log(status)

        this.dataService.toggleDevice({ deviceId: this.data.id, status: status ? 'ON' : 'OFF' }).subscribe(response => {
            const jsonResponse = JSON.parse(response.response);

            if (jsonResponse.state === "ON") {
                this.isLightbulbOn = true;
            } else if (jsonResponse.state === "OFF") {
                this.isLightbulbOn = false;
            }
        });
    }

    private startBlinking(): void {
        this.stopBlinking(); // Ensure no previous interval is running

        const blink = () => {
            this.isLightbulbOn = !this.isLightbulbOn;
            this.blinkInterval = setTimeout(blink, 500); // Toggle every 500ms
        };

        // Initial delay of 500ms before starting the blinking
        this.blinkInterval = setTimeout(blink, 500);
    }

    private stopBlinking(): void {
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
            this.blinkInterval = null;
            this.isLightbulbOn = false;
            this.checked = false;
        }
    }
}
