import { Component, Input } from '@angular/core';
import { Device } from '../../types/device.type';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLightbulb as faLightbulbSolid } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb as faLightbulbRegular } from '@fortawesome/free-regular-svg-icons';

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

    checked: boolean = false;
    isLightbulbOn: boolean = false;
    faLightbulb = faLightbulbSolid;
    faLightbulbRegular = faLightbulbRegular;

    toggleLightbulb() {
        console.log('Lightbulb toggled');
        this.isLightbulbOn = !this.isLightbulbOn;
    }
}
