import { Component } from '@angular/core';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent {
    name: string = 'Pham Duc Chinh';
    id: string = 'B21DCCN181';
    class: string = 'IoT N11';
}
