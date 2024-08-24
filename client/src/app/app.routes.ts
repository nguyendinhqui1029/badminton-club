import { Routes } from '@angular/router';
import { HomeComponent } from '@app/modules/home/home.component';
import { path } from '@app/constants/path.constant';
import { MessagePageComponent } from '@app/components/message-page/message-page.component';
import { MainLayoutComponent } from '@app/layout/main-layout/main-layout.component';
import { DetailComponent } from './modules/home/detail/detail.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: path.HOME.ROOT,
                component: HomeComponent,
            },
            {
                path: path.HOME.DETAIL,
                component: DetailComponent,
            },
            { path: '', redirectTo: `/${path.HOME.ROOT}`, pathMatch: 'full' },
            {
                path: path.ACCOUNT.ROOT, loadChildren: () => import('./modules/account/account.routes').then(module => module.accountRoutes)
            },
            {
                path: path.ATTENDANCE.ROOT, loadChildren: () => import('./modules/attendance/attendance.routes').then(module => module.attendanceRoutes)
            },
            {
                path: path.EVENTS.ROOT, loadChildren: () => import('./modules/events/events.routes').then(module => module.eventsRoutes)
            },
            {
                path: path.LOGIN.ROOT, loadChildren: () => import('./modules/login/login.routes').then(module => module.loginRoutes)
            },
            {
                path: path.NOTIFY.ROOT, loadChildren: () => import('./modules/notify/notify.routes').then(module => module.notifyRoutes)
            },
            {
                path: path.PAYMENT.ROOT, loadChildren: () => import('./modules/payment/payment.routes').then(module => module.paymentRoutes)
            },
            {
                path: path.SHOP.ROOT, loadChildren: () => import('./modules/shop/shop.routes').then(module => module.shopRoutes)
            },
            {
                path: path.TERMS.ROOT, loadChildren: () => import('./modules/terms/terms.routes').then(module => module.termsRoutes)
            }
        ]
    },
    { 
        path: path.NO_PERMISSION, 
        data: {
            backgroundImage: 'url(assets/images/coming-soon-banner.webp)',
            title: 'Không có quyền truy cập.',
            description: 'Chúng tôi rất tiếc. Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ người quản trị trang để được cấp quyền.'
        },
        component: MessagePageComponent
    },
    { 
        path: path.FEATURE_COMING_SOON,
        data: {
            backgroundImage: 'url(assets/images/coming-soon-banner.webp)',
            title: 'Sắp ra mắt!',
            description: 'Chúng tôi sẽ cố gắng ra mắt tính năng này sớm nhất có thể. Bạn có thể quay lại sau và trải nghiệm nó nhá.'
        },
        component: MessagePageComponent
    },
    { 
        path: '**',  
        component: MessagePageComponent, data: {
        backgroundImage: 'url(assets/images/404.webp)',
        title: '',
        description: ''
    },},
   
];
