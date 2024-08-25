import { Component, inject, signal } from '@angular/core';
import { SearchContainerDialogComponent } from '@app/components/dialogs/search-container-dialog/search-container-dialog.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tag-location-dialog',
  standalone: true,
  imports: [SearchContainerDialogComponent],
  templateUrl: './tag-location-dialog.component.html',
  styleUrl: './tag-location-dialog.component.scss'
})
export class TagLocationDialogComponent {
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private dialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);

  private userUnSubscription!: Subscription;

  items = signal<any[]>([]);
  selectedItems = signal<string[]>([]);
  currentUserId= signal<string>('');
  
  onCloseDialog(value: any[]) {
    this.dynamicDialogRef.close(value);
  }

  getLocationOfUser(keyword: string) {
   
  }

  searchInputChange(value: string) {
    this.getLocationOfUser(value);
  }

  ngOnInit(): void {
    this.getLocationOfUser('');
    this.selectedItems.set(this.dialogConfig.data.initializeTagFriends)
  }

  ngOnDestroy(): void {
    if(this.userUnSubscription) {
      this.userUnSubscription.unsubscribe();
    }
  }
}
