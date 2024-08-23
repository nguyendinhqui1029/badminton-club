import { Routes } from '@angular/router';
import { LoginComponent } from '@app/modules/login/login.component';
import { ForgotPasswordComponent } from '@app/modules/login/forgot-password/forgot-password.component';
import { RegisterComponent } from 'app/modules/login/register/register.component';
import { path } from '@app/constants/path.constant';

export const loginRoutes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: path.LOGIN.FORGOT_PASSWORD,
        component: ForgotPasswordComponent
    },
    {
        path: path.LOGIN.REGISTER,
        component: RegisterComponent
    }
];
