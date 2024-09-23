import { Component, Input } from '@angular/core';
import { Device } from '../../types/device.type';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLightbulb as faLightbulbSolid } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb as faLightbulbRegular } from '@fortawesome/free-regular-svg-icons';
import { DataService } from '../../service/data.service';

@Component({
    selector: 'app-device-control',
    standalone: true,
    imports: [
        FormsModule,
        ToggleButtonModule,
        FontAwesomeModule
    ],
    templateUrl: './device-control.component.html',
    styleUrl: './device-control.component.css'
})
export class DeviceControlComponent {
    @Input() data!: Device;

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
}
