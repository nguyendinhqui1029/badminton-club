import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LabelWrapperComponent } from '@app/components/label-wrapper/label-wrapper.component';
import { path } from '@app/constants/path.constant';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink,ButtonModule, LabelWrapperComponent, InputTextModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  login = path.LOGIN.REGISTER;

}
