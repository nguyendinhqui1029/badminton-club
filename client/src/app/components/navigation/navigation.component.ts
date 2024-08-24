import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { AvatarModule } from 'primeng/avatar';
import { RouterModule } from '@angular/router';
import { path } from '@app/constants/path.constant';
import { UserLoginResponse } from '@app/models/user.model';
import { UserService } from '@app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [LogoComponent, AvatarModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit, OnDestroy {

  link = path;
  private userUnSubscription!: Subscription;

  private userService: UserService = inject(UserService);
  currentUser = signal<UserLoginResponse>({
    id: '',
    point: 0,
    email: '',
    phone: '',
    name: '',
    role: [],
    avatar: '',
    birthday: '',
  });

  ngOnInit(): void {
    this.userUnSubscription = this.userService.currentUserLogin.subscribe((value: UserLoginResponse) => {
      this.currentUser.set(value);
    })
  }

  onLogoutClick() {
    this.userService.logout().subscribe(()=>{
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      this.userService.updateData({
        id: '',
        point: 0,
        email: '',
        phone: '',
        name: '',
        role: [],
        avatar: '',
        birthday: ''
      });
      document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    });
  }

  ngOnDestroy(): void {
    if (this.userUnSubscription) {
      this.userUnSubscription.unsubscribe();
    }
  }
}
