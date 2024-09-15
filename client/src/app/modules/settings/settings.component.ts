import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LabelWrapperComponent } from '@app/components/label-wrapper/label-wrapper.component';
import { TermsContentComponent } from '@app/components/terms-content/terms-content.component';
import { UploadFileComponent } from '@app/components/upload-file/upload-file.component';
import { accountType, activeAccountType, genderType, userRole } from '@app/constants/common.constant';
import { UserLoginResponse } from '@app/models/user.model';
import { UserService } from '@app/services/user.service';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { MultiSelectModule } from 'primeng/multiselect';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [PanelModule, TermsContentComponent, ConfirmDialogModule, 
    ReactiveFormsModule, FormsModule, CalendarModule, 
    DropdownModule, RouterLink, CheckboxModule, ButtonModule, 
    LabelWrapperComponent, InputTextModule, UploadFileComponent,
    MultiSelectModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  providers: [ConfirmationService]
})
export class SettingsComponent implements OnInit {
  private userService: UserService = inject(UserService);
 isAdmin = signal<boolean>(false);
 isSuperAdmin = signal<boolean>(false);

  accountTypeOptions = computed(() => [
    { label: 'Người chơi cố định', value: accountType.FIXED_PLAYER },
    { label: 'Người chơi vãng lai', value: accountType.CASUAL_PLAYER },
  ]);
  genderOptions = computed(() => [
    { label: 'Nam', value: genderType.MALE },
    { label: 'Nữ', value: genderType.FEMALE },
  ]);
  statusOptions = computed(() => [
    { label: 'Mở', value: activeAccountType.ON },
    { label: 'Tắt', value: activeAccountType.OFF },
  ]);
  ngOnInit(): void {
    this.userService.currentUserLogin.subscribe((userInfo: UserLoginResponse)=>{
      this.isAdmin.set(userInfo.role.includes(userRole.ADMIN));
      this.isSuperAdmin.set(userInfo.role.includes(userRole.SUPPER_ADMIN));
    });
  }
}
