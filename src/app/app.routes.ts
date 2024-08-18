import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistoryComponent } from './history/history.component';
import { ProfileComponent } from './profile/profile.component';
import { SensorComponent } from './sensor/sensor.component';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
    },
    {
        path: 'sensor',
        component: SensorComponent,
    },
    {
        path: 'history',
        component: HistoryComponent,
    },
    {
        path: 'profile',
        component: ProfileComponent,
    }
];
