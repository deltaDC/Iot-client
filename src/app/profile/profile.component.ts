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
    // name: string = 'Pham Duc Chinh';
    // id: string = 'B21DCCN181';
    // class: string = 'IoT N11';

    studentCode: string = 'B21DCCN181';
    class: string = 'IoT N11';
    name: string = 'Pham Duc Chinh';
    pdfUrl: string = 'https://example.com/your-pdf-file.pdf';
    githubUrl: string = 'https://github.com/deltaDC/Iot-system-client';
    apiDocUrl: string = 'https://example.com/api-doc';
}
