import { afterNextRender, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { LabelWrapperComponent } from '@app/components/label-wrapper/label-wrapper.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { path } from '@app/constants/path.constant';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '@app/services/user.service';
import { localStorageKey } from '@app/constants/common.constant';
import { getUserInfoFromToken } from '@app/utils/auth.util';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SocketService } from '@app/services/socket.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ConfirmDialogModule, ReactiveFormsModule, FormsModule, RouterLink, CheckboxModule, ButtonModule, LabelWrapperComponent, InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [ConfirmationService]
})
export class LoginComponent implements OnInit {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private confirmationService: ConfirmationService = inject(ConfirmationService);

  forgotPassword = path.LOGIN.FORGOT_PASSWORD;
  register = path.LOGIN.REGISTER;


  loginForm!: FormGroup;

  constructor() {
    afterNextRender(() => {
      if(this.userService.currentUserLogin.getValue().id) {
        this.router.navigate([path.HOME.ROOT]);
        return;
      }
      const phone = localStorage.getItem(localStorageKey.PHONE);
      const password = localStorage.getItem(localStorageKey.PASSWORD);
      const isRememberMeBoolean = localStorage.getItem(localStorageKey.IS_REMEMBER_ME) === 'true' && phone !== '' && password !== '';
      this.loginForm.get('isRememberMe')?.patchValue(isRememberMeBoolean);
      if(isRememberMeBoolean) {
        this.loginForm.get('phone')?.setValue(phone);
        this.loginForm.get('password')?.setValue(password);
      }
      this.activatedRoute.queryParams.subscribe((params)=>{
        if(params['phone']) {
          this.loginForm.get('phone')?.setValue(params['phone']);
          this.loginForm.get('password')?.setValue('');
          localStorage.removeItem(localStorageKey.PHONE);
          localStorage.removeItem(localStorageKey.PASSWORD);
          localStorage.setItem(localStorageKey.IS_REMEMBER_ME, 'false');
        }
      })
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      phone: ['', Validators.required],
      password: ['', Validators.required],
      isRememberMe: [false, Validators.required],
    });
    this.loginForm.get('isRememberMe')?.valueChanges.subscribe((value: boolean) => {
      const valueString = value ? 'true' : 'false';
      if(!valueString) {
        localStorage.removeItem(localStorageKey.PHONE);
        localStorage.removeItem(localStorageKey.PASSWORD);
      }
      localStorage.setItem(localStorageKey.IS_REMEMBER_ME, valueString);
    });
  }

  onClickLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.userService.login(this.loginForm.value).subscribe((response) => {
      if (response.statusCode === 402) {
        this.confirmationService.confirm({
          message: 'Số điện thoại hoặc Mật khẩu không đúng. Vui lòng kiểm tra lại.',
          header: 'Thông báo',
          acceptIcon: "none",
          rejectIcon: "none",
          rejectVisible: false
        })
        return;
      }
      localStorage.setItem(localStorageKey.ACCESS_TOKEN, response.data.accessToken);
      localStorage.setItem(localStorageKey.REFRESH_TOKEN, response.data.refreshToken);
      const currentUserLogin = getUserInfoFromToken(response.data.accessToken);
      this.userService.updateData(currentUserLogin);

      if (this.loginForm.value.isRememberMe) {
        localStorage.setItem(localStorageKey.PHONE, this.loginForm.value.phone);
        localStorage.setItem(localStorageKey.PASSWORD, this.loginForm.value.password);
        this.router.navigate([path.HOME.ROOT]);
        return;
      }

      localStorage.removeItem(localStorageKey.PHONE);
      localStorage.removeItem(localStorageKey.PASSWORD);
      this.router.navigate([`/${path.HOME.ROOT}`]);
    })
  }
}
