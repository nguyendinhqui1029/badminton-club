import { Component, inject, input, OnInit } from '@angular/core';
import { LabelWrapperComponent } from '@app/components/label-wrapper/label-wrapper.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { path } from '@app/constants/path.constant';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, CheckboxModule,ButtonModule, LabelWrapperComponent, InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

    forgotPassword = path.LOGIN.FORGOT_PASSWORD;
    register = path.LOGIN.REGISTER;

    formBuilder: FormBuilder = inject(FormBuilder);

    loginForm!: FormGroup;
    
    ngOnInit(): void {
      this.loginForm = this.formBuilder.group({
        phone: ['', Validators.required],
        password: ['', Validators.required],
        isRememberMe: [false, Validators.required],
      });
    }

    onClickLogin() {
      console.log('login', this.loginForm.value)
    }
}
