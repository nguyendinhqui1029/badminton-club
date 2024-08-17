import { Component } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { AvatarModule } from 'primeng/avatar';
import { RouterModule } from '@angular/router';
import { path } from '@app/constants/path.constant';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [LogoComponent, AvatarModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  link = path;
}
