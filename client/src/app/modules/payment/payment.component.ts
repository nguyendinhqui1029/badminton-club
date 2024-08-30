import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [TabViewModule, PanelModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {

}
