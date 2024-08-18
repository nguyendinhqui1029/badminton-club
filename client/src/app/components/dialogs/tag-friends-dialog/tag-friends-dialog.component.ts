import { Component, inject, signal } from '@angular/core';
import { SearchContainerDialogComponent } from '@app/components/dialogs/search-container-dialog/search-container-dialog.component';
import { AvatarModule } from 'primeng/avatar';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

interface UserInfoSearch {
    id: string;
    name: string;
    avatar: string;
}

@Component({
  selector: 'app-tag-friends-dialog',
  standalone: true,
  imports: [AvatarModule, SearchContainerDialogComponent],
  templateUrl: './tag-friends-dialog.component.html',
  styleUrl: './tag-friends-dialog.component.scss'
})
export class TagFriendsDialogComponent {
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);

  items = signal<UserInfoSearch[]>([]);
  selectedItems = signal<string[]>([]);

  onCloseDialog(value: UserInfoSearch[]) {
    this.dynamicDialogRef.close(value);
  }
}
