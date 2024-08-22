import { Component } from '@angular/core';
import { LogoComponent } from '@app/components/logo/logo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
