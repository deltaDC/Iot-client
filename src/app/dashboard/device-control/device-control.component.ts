import { Component, Input } from '@angular/core';
import { Device } from '../../types/device.type';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-device-control',
  standalone: true,
  imports: [
    FormsModule,
    ToggleButtonModule
  ],
  templateUrl: './device-control.component.html',
  styleUrl: './device-control.component.css'
})
export class DeviceControlComponent {
  @Input() data!: Device;

  checked: boolean = false;
  cnt = 0

  switchChange() {
    this.cnt++
    console.log('Switch changed');
    console.log(this.cnt)
  }
}
