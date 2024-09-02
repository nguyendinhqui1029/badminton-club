import { Component, computed, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LabelWrapperComponent } from '@app/components/label-wrapper/label-wrapper.component';
import { path } from '@app/constants/path.constant';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { accountType, genderType } from '@app/constants/common.constant';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TermsDialogComponent } from '@app/components/dialogs/terms-dialog/terms-dialog.component';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from '@app/services/user.service';
import { UserRequestBody } from '@app/models/user.model';
import { ToastModule } from 'primeng/toast';
import { ValidatorService } from '@app/services/validators.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ConfirmDialogModule, ToastModule, ReactiveFormsModule, FormsModule, CalendarModule, DropdownModule, RouterLink, CheckboxModule, ButtonModule, LabelWrapperComponent, InputTextModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [ConfirmationService, DialogService, MessageService]

})
export class RegisterComponent implements OnInit {
  login = `/${path.LOGIN.ROOT}`;

  accountTypeOptions = computed(() => [
    { label: 'Người chơi cố định', value: accountType.FIXED_PLAYER },
    { label: 'Người chơi vãng lai', value: accountType.CASUAL_PLAYER },
  ]);
  genderOptions = computed(() => [
    { label: 'Nam', value: genderType.MALE },
    { label: 'Nữ', value: genderType.FEMALE },
  ]);

  private formBuilder: FormBuilder = inject(FormBuilder);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private dialogService: DialogService = inject(DialogService);
  private dynamicDialogRef: DynamicDialogRef | undefined;
  private platformId: Object = inject(PLATFORM_ID);
  private userService: UserService = inject(UserService);
  private messageService: MessageService = inject(MessageService);
  private router: Router = inject(Router);

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', ValidatorService.fieldRequired('Tên không được để trống.')],
      birthday: ['', ValidatorService.fieldRequired('Ngày sinh không được để trống.')],
      gender: [genderType.MALE],
      accountType: [accountType.FIXED_PLAYER],
      email: ['', ValidatorService.fieldRequired('Email không được để trống.')],
      phone: ['', ValidatorService.fieldRequired('Số điện không được để trống.')],
      password: ['', ValidatorService.fieldRequired('Mật khẩu không được để trống.'), ValidatorService.minLength(6, 'Mật khẩu phải ít nhất 6 kí tự.')],
      confirmPassword: ['', ValidatorService.fieldRequired('Xác nhận mật khẩu không được để trống.')],
      terms: [false, ValidatorService.checkboxRequired('Điều khoản bắt buộc phải nhập.')],
    }, { validator: (formGroup: FormGroup)=> ValidatorService.passwordsMatch(formGroup, 'Mật khẩu và Xác nhận mật khẩu không khớp.') });

    this.registerForm.get('accountType')?.valueChanges.subscribe((value) => {
      if (value === accountType.CASUAL_PLAYER) {
        this.confirmationService.confirm({
          message: 'Một khi bạn chọn loại tài khoản này, bạn sẽ bị mất một số quyền lợi trong điều khoản bên dưới. Bạn có chắc chắn muốn tạo tài khoản loại này?',
          header: 'Xác nhận',
          icon: 'pi pi-exclamation-triangle',
          acceptIcon: "none",
          rejectIcon: "none",
          rejectButtonStyleClass: "p-button-text",
          accept: () => {
            this.registerForm.get('accountType')?.setValue(accountType.CASUAL_PLAYER);
          },
          reject: () => {
            this.registerForm.get('accountType')?.setValue(accountType.FIXED_PLAYER);
          }
        });
      }
    });
  }

  onClickRegister() {
    this.registerForm.markAllAsTouched();
    if(!this.registerForm.valid) {
      return;
    }
    const body: UserRequestBody = {
      id: null,
      email: this.registerForm.value['email'] || '',
      phone: this.registerForm.value['phone'] || '',
      name: this.registerForm.value['name'] || '',
      password: this.registerForm.value['password'] || '',
      birthday: this.registerForm.value['birthday'] || '',
      status: 'ON',
      gender: this.registerForm.value['gender'] || genderType.MALE,
      accountType: this.registerForm.value['accountType'] || accountType.FIXED_PLAYER,
  };
    this.userService.create(body).subscribe((response)=>{
      if(response.statusCode === 200){
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Tạo tài khoản thành công.' });
        this.router.navigate([this.login])
        return;
      }
      this.messageService.add({ severity: 'danger', summary: 'Thông báo', detail: 'Tạo tài khoản thất bại vui lòng kiểm tra lại.' });
    });
  }

  onClickOpenTerm() {
    this.dynamicDialogRef = this.dialogService.open(TermsDialogComponent, {
      showHeader: false,
      width: '80vw',
      modal: true,
      transitionOptions: '450ms',
      appendTo: 'body',
      data: {
        id: null
      }
    });

    if (isPlatformBrowser(this.platformId) && window.matchMedia('(max-width: 500px)').matches) {
      this.dialogService.getInstance(this.dynamicDialogRef).maximize();
    }
  }
}
