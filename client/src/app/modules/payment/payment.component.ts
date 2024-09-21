import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CommonOption } from '@app/models/common-option.model';
import { ButtonModule } from 'primeng/button';
import { PaymentCardComponent } from '@app/components/payment-card/payment-card.component';
import { PaymentCard, PaymentResponseValue } from '@app/models/payment.model';
import { CURRENT_USER_INIT, paymentStatus, paymentType, userRole } from '@app/constants/common.constant';
import { UserService } from '@app/services/user.service';
import { UserLoginResponse } from '@app/models/user.model';
import { TableModule } from 'primeng/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabelWrapperComponent } from '@app/components/label-wrapper/label-wrapper.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UploadFileComponent } from '@app/components/upload-file/upload-file.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaymentService } from '@app/services/payment.service';
import { ValidatorService } from '@app/services/validators.service';
import { MessageService } from 'primeng/api';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    TableModule, TabViewModule
    , PanelModule, DropdownModule
    , InputTextModule, ButtonModule
    , PaymentCardComponent, CurrencyPipe
    , DatePipe, ToastModule
    , LabelWrapperComponent,
    InputNumberModule, UploadFileComponent,
    InputTextareaModule,
    MultiSelectModule,
    FormsModule,
    ReactiveFormsModule,],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  @ViewChild('fileUploadRef', { static: false }) fileUploadRef!: UploadFileComponent;

  private userService: UserService = inject(UserService);
  private paymentService: PaymentService = inject(PaymentService);
  private messageService: MessageService = inject(MessageService);

  private formBuilder: FormBuilder = inject(FormBuilder);
  formPaymentGroup!: FormGroup;

  typeOptions: CommonOption[] = [{
    label: 'Nạp tiền',
    value: paymentType.RECHARGE
  },
  {
    label: 'Rút tiền',
    value: paymentType.WITHDRAW
  }];

  statusOptions: CommonOption[] = [
    {
      label: 'Tất cả',
      value: 'All'
    },
    {
      label: 'Chờ đóng',
      value: 'PENDING'
    },
    {
      label: 'Đã đóng',
      value: 'DONE'
    },
    {
      label: 'Đóng trễ',
      value: 'LATE'
    }
  ];

  isAdmin = signal<boolean>(false);
  isSupperAdmin = signal<boolean>(false);

  rechargeHistories: PaymentResponseValue[] = [];
  withdrawHistories: PaymentResponseValue[] = [];
  currentDate = signal<Date>(new Date());
  userList = signal<CommonOption[]>([]);
  currentUser = signal<UserLoginResponse>(CURRENT_USER_INIT);

  keyword = signal<string>('');
  status: string = 'All';
  subject: Subject<string> = new Subject<string>();
  paymentItemSearch = signal<PaymentCard[]>([]);
  paymentInfo: PaymentCard = {
    createdAt: '2024-08-30',
    id: '1232',
    userName: 'Nguyễn Văn A',
    total: 10000,
    status: paymentStatus.WAITING,
    detail: [{
      name: 'Tiền sân',
      amount: 10000
    }]
  };
  ngOnInit(): void {
    this.handleSearch(this.keyword(), this.status);
    this.subject.pipe(debounceTime(300)).subscribe((value: string) => {
      this.handleSearch(value, this.status);
    });
    this.userService.currentUserLogin.subscribe(userInfo => {
      this.currentUser.set(userInfo);
    });
    this.formPaymentGroup = this.formBuilder.group({
      receivers: [[], ValidatorService.fieldRequired('Người nhận không được để trống.')],
      title: ['', ValidatorService.fieldRequired('Tiêu đề không được để trống.')],
      description: ['', ValidatorService.fieldRequired('Mô tả không được để trống.')],
      amount: [0, ValidatorService.fieldRequired('Số tiền không được để trống.')],
      files: [[]],
      type: [paymentType.RECHARGE]
    });
    this.userService.currentUserLogin.subscribe((userInfo: UserLoginResponse) => {
      this.isAdmin.set(userInfo.role.includes(userRole.ADMIN));
      this.isSupperAdmin.set(userInfo.role.includes(userRole.SUPPER_ADMIN));
    });

    this.userService.getAllUser().subscribe((response) => {
      if (response.statusCode !== 200) {
        return;
      }
      this.userList.set(response.data.map((item) => ({ label: item.name, value: item.id })));
    });
  }

  onSearchStatusChange(event: DropdownChangeEvent) {
    this.status = event.value;
    this.handleSearch(this.keyword(), event.value);
  }

  onSearchInputChange(event: Event) {
    this.subject.next((event as InputEvent).data || '');
  }

  handleSearch(keyword: string, status: string) {
    status = status === 'All' ? '' : status;
    this.paymentService.getAllPayment(keyword, status).subscribe((response) => {
      if (response.statusCode !== 200) {
        this.paymentItemSearch.set([]);
        return;
      }
      console.log(response.data)
      this.paymentItemSearch.set(response.data.map(item => ({
        createdAt: item.createdAt || '',
        id: item.id || '',
        userName: item?.user?.[0]?.name || '',
        total: +item.amount || 0,
        status: item.status || 'PENDING',
        detail: [{
          name: item.title || '',
          amount: +item.amount || 0
        }]
      })));
    });
  }

  onCreatePayment() {
    this.formPaymentGroup.markAllAsTouched();
    if (this.formPaymentGroup.valid) {
      const body = {
        idUser: this.formPaymentGroup.value['receivers'] || [],
        amount: this.formPaymentGroup.value['amount'] || 0,
        title: this.formPaymentGroup.value['title'] || '',
        content: this.formPaymentGroup.value['description'] || '',
        files: this.formPaymentGroup.value['files'] || [],
        status: 'PENDING',
        type: this.formPaymentGroup.value['type'] || paymentType.RECHARGE,
        createdBy: this.currentUser().id
      };
      this.paymentService.createMultipleTransaction(body).subscribe((response) => {
        if (response.statusCode !== 200) {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Có lỗi xảy ra trong quá trình tạo. Vui lòng tạo lại.' })
          return;
        }
        this.fileUploadRef.requestChangeStatusFile(() => {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Bài viết được tạo thành công!' });
          this.formPaymentGroup.reset({
            receivers: '',
            title: '',
            description: '',
            amount: 0,
            files: 0,
            type: paymentType.RECHARGE
          });
          this.handleSearch(this.keyword(), this.status);
        });
      });
    }
  }
}
