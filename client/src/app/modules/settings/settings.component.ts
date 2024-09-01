import { Component, signal } from '@angular/core';
import { TermsContentComponent } from '@app/components/terms-content/terms-content.component';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [PanelModule, TermsContentComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
 isShowForAdmin = signal<boolean>(true);
}
