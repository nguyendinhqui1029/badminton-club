import { Routes } from '@angular/router';
import { HomeComponent } from '@app/modules/home/home.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        data: {
            contentFull: false
        }
    },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'account', loadChildren: () => import('./modules/account/account.routes').then(module => module.accountRoutes), data: {
            contentFull: true
        }
    },
    {
        path: 'attendance', loadChildren: () => import('./modules/attendance/attendance.routes').then(module => module.attendanceRoutes), data: {
            contentFull: true
        }
    },
    {
        path: 'events', loadChildren: () => import('./modules/events/events.routes').then(module => module.eventsRoutes), data: {
            contentFull: true
        }
    },
    {
        path: 'login', loadChildren: () => import('./modules/login/login.routes').then(module => module.loginRoutes), data: {
            contentFull: true
        }
    },
    {
        path: 'notify', loadChildren: () => import('./modules/notify/notify.routes').then(module => module.notifyRoutes), data: {
            contentFull: true
        }
    },
    {
        path: 'payment', loadChildren: () => import('./modules/payment/payment.routes').then(module => module.paymentRoutes), data: {
            contentFull: true
        }
    },
    {
        path: 'shop', loadChildren: () => import('./modules/shop/shop.routes').then(module => module.shopRoutes), data: {
            contentFull: true
        }
    },
    {
        path: 'terms', loadChildren: () => import('./modules/terms/terms.routes').then(module => module.termsRoutes), data: {
            contentFull: true
        }
    },
];
