import { Component, computed, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
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
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TermsDialogComponent } from '@app/components/dialogs/terms-dialog/terms-dialog.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ConfirmDialogModule, ReactiveFormsModule, FormsModule, CalendarModule, DropdownModule, RouterLink, CheckboxModule, ButtonModule, LabelWrapperComponent, InputTextModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [ConfirmationService, DialogService]

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

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      birthday: ['', Validators.required],
      gender: [genderType.MALE, Validators.required],
      accountType: [accountType.FIXED_PLAYER, Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required, Validators.minLength(6)],
      rePassword: ['', Validators.required, Validators.minLength(6)],
      terms: [false, Validators.required],
    });

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
    })
  }

  onClickRegister() {
    console.log('Register', this.registerForm.value)
  }

  onClickOpenTerm() {
    this.dynamicDialogRef = this.dialogService.open(TermsDialogComponent, {
      showHeader: false,
      width: '450px',
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
