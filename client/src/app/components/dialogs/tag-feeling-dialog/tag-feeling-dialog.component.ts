import { Component, inject, signal } from '@angular/core';
import { SearchContainerGroupComponent } from '@app/components/search-container-group/search-container-group.component';
import { INITIALIZE_FEELING_DATA } from '@app/constants/feeling.constant';
import { DataSearchGroup } from '@app/models/search-group.model';
import { FeelingGroupValue, FeelingValue } from '@app/models/user.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tag-feeling-dialog',
  standalone: true,
  imports: [SearchContainerGroupComponent],
  templateUrl: './tag-feeling-dialog.component.html',
  styleUrl: './tag-feeling-dialog.component.scss'
})
export class TagFeelingDialogComponent {
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private dialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);

  private userUnSubscription!: Subscription;

  items = signal<DataSearchGroup<FeelingValue>[]>([]);
  selectedItems = signal<string[]>([]);
  currentUserId= signal<string>('');
  isLoading = signal<boolean>(true);

  onCloseDialog(value: DataSearchGroup<FeelingValue>[]) {
    this.dynamicDialogRef.close(value);
  }

  getFeelingOfUser(keyword: string) {
    this.isLoading.set(true);
    if(keyword?.trim()) {
      this.items.set(INITIALIZE_FEELING_DATA.map((item:DataSearchGroup<FeelingValue>)=> ({
        ...item,
        children: item.children.filter((feeling: FeelingValue)=> feeling.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
      })));
      return;
    }
    this.items.set(INITIALIZE_FEELING_DATA);
    this.isLoading.set(false);
  }

  searchInputChange(value: string) {
    this.getFeelingOfUser(value);
  }

  ngOnInit(): void {
    this.getFeelingOfUser('');
    this.selectedItems.set(this.dialogConfig.data.initializeTagFeeling)
  }

  ngOnDestroy(): void {
    if(this.userUnSubscription) {
      this.userUnSubscription.unsubscribe();
    }
  }
}
