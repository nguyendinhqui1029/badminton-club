import { Component, inject, OnInit, signal } from '@angular/core';
import { SearchContainerDialogComponent } from '@app/components/dialogs/search-container-dialog/search-container-dialog.component';
import { UserInfoSearch, UserInfoSearchResponse } from '@app/models/user.model';
import { UserService } from '@app/services/user.service';
import { AvatarModule } from 'primeng/avatar';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-tag-friends-dialog',
  standalone: true,
  imports: [AvatarModule, SearchContainerDialogComponent],
  templateUrl: './tag-friends-dialog.component.html',
  styleUrl: './tag-friends-dialog.component.scss'
})
export class TagFriendsDialogComponent implements OnInit {
  
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private dialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private userService: UserService = inject(UserService);

  items = signal<UserInfoSearch[]>([]);
  selectedItems = signal<string[]>([]);
  currentUserId: string = '66c17a38d69f28009ab7ab88';
  
  onCloseDialog(value: UserInfoSearch[]) {
    this.dynamicDialogRef.close(value);
  }

  getFriendsOfUser(keyword: string) {
    this.userService.searchUserByKeyword(this.currentUserId, keyword).subscribe((response)=>{
      if(response.statusCode !== 200) {
        this.items.set([]);
        return;
      }
      this.items.set(response.data.map((item: UserInfoSearchResponse)=>item.friends));
    });
  }

  searchInputChange(value: string) {
    this.getFriendsOfUser(value);
  }

  ngOnInit(): void {
    this.getFriendsOfUser('');
    this.selectedItems.set(this.dialogConfig.data.initializeTagFriends)
  }
}
