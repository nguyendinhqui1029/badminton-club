import { Component, inject, OnInit, signal } from '@angular/core';
import { TermsContentComponent } from '@app/components/terms-content/terms-content.component';
import { userRole } from '@app/constants/common.constant';
import { UserLoginResponse } from '@app/models/user.model';
import { UserService } from '@app/services/user.service';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [PanelModule, TermsContentComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  private userService: UserService = inject(UserService);
 isAdmin = signal<boolean>(false);
 isSuperAdmin = signal<boolean>(false);
  ngOnInit(): void {
    this.userService.currentUserLogin.subscribe((userInfo: UserLoginResponse)=>{
      this.isAdmin.set(userInfo.role.includes(userRole.ADMIN));
      this.isSuperAdmin.set(userInfo.role.includes(userRole.SUPPER_ADMIN));
    });
  }
}
