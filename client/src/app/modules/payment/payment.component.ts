import { Component, inject, OnInit, signal } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CommonOption } from '@app/models/common-option.model';
import { ButtonModule } from 'primeng/button';
import { PaymentCardComponent } from '@app/components/payment-card/payment-card.component';
import { PaymentCard, PaymentResponseValue } from '@app/models/payment-card.model';
import { paymentStatus, userRole } from '@app/constants/common.constant';
import { UserService } from '@app/services/user.service';
import { UserLoginResponse } from '@app/models/user.model';
import { TableModule } from 'primeng/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabelWrapperComponent } from '@app/components/label-wrapper/label-wrapper.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UploadFileComponent } from '@app/components/upload-file/upload-file.component';
import { MultiSelectModule } from 'primeng/multiselect';
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    TableModule, TabViewModule
    , PanelModule, DropdownModule
    , InputTextModule, ButtonModule
    , PaymentCardComponent, CurrencyPipe
    , DatePipe, ToastModule
    , ReactiveFormsModule, FormsModule
    , LabelWrapperComponent,
    InputNumberModule, UploadFileComponent,
    InputTextareaModule,
    MultiSelectModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  private userService: UserService = inject(UserService);
  statusOptions: CommonOption[] = [
    {
      label: 'Tất cả',
      value: 'All'
    },
    {
      label: 'Chờ đóng',
      value: 'Waiting'
    },
    {
      label: 'Đã đóng',
      value: 'Done'
    },
    {
      label: 'Đóng trễ',
      value: 'Late'
    }
  ];
  paymentInfo: PaymentCard = {
    createdAt: '31-08-2024',
    id: '1232',
    userName: 'Nguyễn Văn A',
    total: 10000,
    status: paymentStatus.WAITING,
    detail: [{
      name: 'Tiền sân',
      amount: 10000
    }]
  };
  isAdmin = signal<boolean>(false);
  isSupperAdmin = signal<boolean>(false);

  rechargeHistories: PaymentResponseValue[] = [];
  withdrawHistories: PaymentResponseValue[] = [];
  currentDate = signal<Date>(new Date());
  userList = signal<CommonOption[]>([]);
  ngOnInit(): void {
    this.userService.currentUserLogin.subscribe((userInfo: UserLoginResponse)=>{
      this.isAdmin.set(userInfo.role.includes(userRole.ADMIN));
      this.isSupperAdmin.set(userInfo.role.includes(userRole.SUPPER_ADMIN));
    });

    this.userService.getAllUser().subscribe((response)=>{
      if(response.statusCode !== 200) {
        return;
      }
      this.userList.set(response.data.map((item)=>({label: item.name, value: item.id})));
    });
  }
}
