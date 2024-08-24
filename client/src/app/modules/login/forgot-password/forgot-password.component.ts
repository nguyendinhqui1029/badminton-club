import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LabelWrapperComponent } from '@app/components/label-wrapper/label-wrapper.component';
import { emailType } from '@app/constants/common.constant';
import { path } from '@app/constants/path.constant';
import { EmailRequestBody } from '@app/models/email.model';
import { EmailService } from '@app/services/email.service';
import { UserService } from '@app/services/user.service';
import { ValidatorService } from '@app/services/validators.service';
import { startTimer } from '@app/utils/common.util';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ConfirmDialogModule, ReactiveFormsModule, FormsModule, RouterLink,ButtonModule, LabelWrapperComponent, InputTextModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  providers: [ConfirmationService]

})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  
  private countdownSubscription: Subscription | undefined;
  private emailService: EmailService = inject(EmailService);
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private confirmationService: ConfirmationService = inject(ConfirmationService);

  login = `/${path.LOGIN.ROOT}`;
  isButtonEnabled: boolean = true;
  countdown = signal<number>(0);
  countDownDisplay = computed(()=>this.countdown() > 0 ? `${this.countdown()}s` : '')
  forgotPasswordForm!: FormGroup;

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', ValidatorService.fieldRequired('Địa chỉ email là bắt buộc')],
      code: ['', ValidatorService.fieldRequired('Code là bắt buộc')],
      password: ['', 
        [ValidatorService.fieldRequired('Mật khẩu là bắt buộc'), 
        ValidatorService.minLength(6, 'Mật khẩu phải có ít nhất 6 kí tự')]],
      confirmPassword: ['', 
        [ValidatorService.fieldRequired('Xác nhận mật khẩu là bắt buộc'), 
        ValidatorService.minLength(6, 'Mật khẩu phải có ít nhất 6 kí tự')]],
    }, { validator: (formGroup: FormGroup)=> ValidatorService.passwordsMatch(formGroup, 'Mật khẩu và Xác nhận mật khẩu không khớp.') });
  }

  
  onGetCodeClick(): void {
    if (this.isButtonEnabled) {
      this.isButtonEnabled = false
      const body: EmailRequestBody = {
        to: this.forgotPasswordForm.value.email,
        subject: 'Phản hồi yêu cầu mã cho thay đổi mật khẩu',
        text: 'Vui lòng không phản hồi lại mail này.',
        html: `Mã thay đổi mật khẩu của bạn là <strong>{code}</strong>. Nó sẽ hết hạn trong 120 giây nữa.`,
        sendDate: new Date(),
        type: emailType.RESET_PASSWORD
    }
      this.emailService.sendEmailResetPassword(body).subscribe();
      this.countdownSubscription = startTimer(this.countdown, () => {
        this.isButtonEnabled = true;
      }, 2*60);
    }
  }
  
  onChangePassword() {
    this.forgotPasswordForm.markAllAsTouched();
    if(this.forgotPasswordForm.valid) {
      this.userService.resetPassword({
        code: this.forgotPasswordForm.value.code,
        password: this.forgotPasswordForm.value.password,
        email: this.forgotPasswordForm.value.email,
      }).subscribe((response)=>{
        if(+response.statusCode !== 200) {
          this.confirmationService.confirm({
            message: +response.statusCode === 405 ? 'Code không đúng hoặc bị hết hạn. Vui lòng kiểm tra lại.' :'Thay đổi mật khẩu không thành công. Vui lòng thử lại.',
            header: 'Thông báo',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
          });
          return;
        }
        this.router.navigate([path.LOGIN.ROOT], {
          queryParams: { 
            phone: response.data.phone
          }
        });
      })
    }
  }

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
}

