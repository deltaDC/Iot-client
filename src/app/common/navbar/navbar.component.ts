import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [TabMenuModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {
    items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                label: 'Dashboard',
                icon: 'pi pi-home',
                routerLink: ['/dashboard']
            },
            {
                label: 'Sensor',
                icon: 'pi pi-database',
                routerLink: ['/sensor']
            },
            {
                label: 'History',
                icon: 'pi pi-history',
                routerLink: ['/history']
            },
            {
                label: 'Profile',
                icon: 'pi pi-user',
                routerLink: ['/profile']
            }
        ]
    }
}
