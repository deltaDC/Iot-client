import { Component, Input } from '@angular/core';
import { Device } from '../../types/device.type';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-device-control',
  standalone: true,
  imports: [MatSlideToggleModule],
  templateUrl: './device-control.component.html',
  styleUrl: './device-control.component.css'
})
export class DeviceControlComponent {
  @Input() data!: Device;
}
