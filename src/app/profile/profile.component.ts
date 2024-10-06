import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CardModule, ButtonModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent {

    studentCode: string = 'B21DCCN181';
    class: string = 'IoT N11';
    name: string = 'Pham Duc Chinh';
    pdfUrl: string = 'https://drive.google.com/file/d/1YkZEOKYMwZwoxNt7UgPNa_iRcapkI8A0/view?usp=sharing';
    githubUrl: string = 'https://github.com/deltaDC/Iot-system-client';
    apiDocUrl: string = 'https://documenter.getpostman.com/view/23859003/2sAXqv3fUV';
}
