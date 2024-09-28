import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LabelWrapperComponent } from '@app/components/label-wrapper/label-wrapper.component';
import { TermsContentComponent } from '@app/components/terms-content/terms-content.component';
import { UploadFileComponent } from '@app/components/upload-file/upload-file.component';
import { accountType, activeAccountType, CURRENT_USER_INIT, genderType, userRole } from '@app/constants/common.constant';
import { UserInfoWithIdFriendResponse, UserLoginResponse } from '@app/models/user.model';
import { UserService } from '@app/services/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { MultiSelectModule } from 'primeng/multiselect';
import { ValidatorService } from '@app/services/validators.service';
import { ToastModule } from 'primeng/toast';
import { LoadingComponent } from '@app/components/loading/loading.component';
import { DayTimePickerComponent } from '@app/components/day-time-picker/day-time-picker.component';
import { SettingsService } from '@app/services/settings.service';
import { SettingsRequestBody, SettingsResponseValue } from '@app/models/setting.model';
import { DayTimePicker } from '@app/models/day-time-picker.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [PanelModule, TermsContentComponent, ConfirmDialogModule,
    ReactiveFormsModule, FormsModule, CalendarModule,
    DropdownModule, RouterLink, CheckboxModule, ButtonModule,
    LabelWrapperComponent, InputTextModule, UploadFileComponent,
    MultiSelectModule, ToastModule, LoadingComponent,
    DayTimePickerComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  providers: [ConfirmationService]
})
export class SettingsComponent implements OnInit {
  private userService: UserService = inject(UserService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private messageService: MessageService = inject(MessageService);
  private settingsService: SettingsService = inject(SettingsService);

  isAdmin = signal<boolean>(false);
  isSuperAdmin = signal<boolean>(false);
  isShowLoadingUserSettingForm = signal<boolean>(true);
  isShowLoadingCheckInInfoForm = signal<boolean>(true);

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

  userSettingForm!: FormGroup;
  checkInInfoForm!: FormGroup;
  feeForm!: FormGroup;

  currentUserLogin!: UserInfoWithIdFriendResponse;
  setting!: SettingsResponseValue;

  ngOnInit(): void {
    this.userService.getUserById(this.userService.currentUserLogin.getValue().id).subscribe(response => {
      this.isShowLoadingUserSettingForm.update(() => false);
      if (response.statusCode !== 200) {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Lấy thông tin người dùng thất bại!' })
        return;
      }
      this.currentUserLogin = response.data;
      this.isAdmin.set(this.currentUserLogin.role.includes(userRole.ADMIN));
      this.isSuperAdmin.set(this.currentUserLogin.role.includes(userRole.SUPPER_ADMIN));
      this.userSettingForm = this.formBuilder.group({
        point: [this.currentUserLogin.point || 0],
        email: [this.currentUserLogin.email || ''],
        phone: [this.currentUserLogin.phone || ''],
        name: [this.currentUserLogin.name, ValidatorService.fieldRequired('Họ tên không được để trống.')],
        accountType: [this.currentUserLogin.accountType || accountType.FIXED_PLAYER],
        gender: [this.currentUserLogin.gender || genderType.MALE],
        status: [this.currentUserLogin.status || activeAccountType.ON],
        birthday: [new Date(this.currentUserLogin.birthday) || '', ValidatorService.fieldRequired('Ngày sinh không được để trống.')],
        avatar: [[this.currentUserLogin.avatar], ValidatorService.fieldRequired('Ảnh đại không được để trống.')],
      });
      this.userSettingForm.get('point')?.disable();
      this.userSettingForm.get('email')?.disable();
      this.userSettingForm.get('phone')?.disable();
    });
    this.settingsService.getSetting().subscribe(response => {
      if (response.statusCode !== 200) {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Lấy thông checkin thất bại!' })
        return;
      }
      this.isShowLoadingCheckInInfoForm.update(() => false);
      this.setting = response.data;
      const checkInDate = (this.setting?.requiredCheckInTime || []).map(item => ({
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime
      }));
      this.checkInInfoForm = this.formBuilder.group({
        longitude: [this.setting?.checkInLocationLongitude || '', ValidatorService.fieldRequired('Kinh độ không được để trống.')],
        latitude: [this.setting?.checkInLocationLatitude || '', ValidatorService.fieldRequired('Vĩ độ không được để trống.')],
        radian: [this.setting?.checkInRadian || '', ValidatorService.fieldRequired('Bán kính không được để trống.')],
        checkInDate: [checkInDate || [], ValidatorService.fieldRequired('Thời gian điểm danh không được để trống.')]
      });
      this.feeForm = this.formBuilder.group({
        earlyAttendanceReward: [this.setting?.earlyAttendanceReward || 0],
        tenMinuteLateFee: [this.setting?.tenMinuteLateFee || 0],
        twentyMinuteLateFee: [this.setting?.twentyMinuteLateFee || 0],
        absenceFee: [this.setting?.absenceFee || 0],
        latePaymentFee: [this.setting?.latePaymentFee || 0]
      });
    });
  }

  handleSaveUserSetting() {
    if (this.userSettingForm.valid) {
      this.userService.updateUser({ id: this.currentUserLogin.id, ...this.userSettingForm.getRawValue(), avatar: this.userSettingForm.getRawValue().avatar[0] }).subscribe(response => {
        if (response.statusCode !== 200) {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Lưu thông tin người dùng thất bại!' })
          return;
        }
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Lưu thông tin người dùng thành công!' })
      });
    }
  }

  handleSaveCheckInInfo() {
    if (this.checkInInfoForm.valid) {
      const body: Partial<SettingsRequestBody> = {
        checkInLocationLongitude: this.checkInInfoForm.getRawValue().longitude,
        checkInLocationLatitude: this.checkInInfoForm.getRawValue().latitude,
        checkInRadian: this.checkInInfoForm.getRawValue().radian,
        requiredCheckInTime: this.checkInInfoForm.getRawValue().checkInDate.filter((item:DayTimePicker)=>item.startTime && item.endTime)
      };
      (this.setting?.id ?
        this.settingsService.updateSetting(this.setting.id, body)
        : this.settingsService.createSetting(body)
      ).subscribe(response => {
            if (response.statusCode !== 200) {
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Lưu thông tin người dùng thất bại!' })
              return;
            }
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Lưu thông tin người dùng thành công!' })
          });
    }
  }

  handleSaveFeeForm() {
    if (this.feeForm.valid) {
      const body: Partial<SettingsRequestBody> = {
        earlyAttendanceReward: this.feeForm.getRawValue().earlyAttendanceReward,
        tenMinuteLateFee: this.feeForm.getRawValue().tenMinuteLateFee,
        twentyMinuteLateFee: this.feeForm.getRawValue().twentyMinuteLateFee,
        absenceFee: this.feeForm.getRawValue().absenceFee,
        latePaymentFee: this.feeForm.getRawValue().latePaymentFee
      };
      (this.setting?.id ?
        this.settingsService.updateSetting(this.setting.id, body)
        : this.settingsService.createSetting(body)
      ).subscribe(response => {
            if (response.statusCode !== 200) {
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Lưu thông tin người dùng thất bại!' })
              return;
            }
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Lưu thông tin người dùng thành công!' })
          });
    }
  }
}
