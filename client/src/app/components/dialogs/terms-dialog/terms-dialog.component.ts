import { Component, inject } from '@angular/core';
import { TermsContentComponent } from '@app/components/terms-content/terms-content.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-terms-dialog',
  standalone: true,
  imports: [TermsContentComponent],
  templateUrl: './terms-dialog.component.html',
  styleUrl: './terms-dialog.component.scss'
})
export class TermsDialogComponent {
  title: string = 'Điểu khoản';
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);

  onClickCloseDialog() {
    this.dynamicDialogRef.close();
  }
}
