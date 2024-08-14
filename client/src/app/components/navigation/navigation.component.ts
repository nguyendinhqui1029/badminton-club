import { Component } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [LogoComponent, AvatarModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {

}
