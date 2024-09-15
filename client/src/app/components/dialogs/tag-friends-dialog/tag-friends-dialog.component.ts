import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { SearchContainerDialogComponent } from '@app/components/dialogs/search-container-dialog/search-container-dialog.component';
import { defaultAvatar } from '@app/constants/common.constant';
import { UserInfoSearch, UserInfoSearchResponse, UserLoginResponse } from '@app/models/user.model';
import { UserService } from '@app/services/user.service';
import { AvatarModule } from 'primeng/avatar';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tag-friends-dialog',
  standalone: true,
  imports: [AvatarModule, SearchContainerDialogComponent],
  templateUrl: './tag-friends-dialog.component.html',
  styleUrl: './tag-friends-dialog.component.scss'
})
export class TagFriendsDialogComponent implements OnInit, OnDestroy {
  
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private dialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private userService: UserService = inject(UserService);

  private userUnSubscription!: Subscription;

  items = signal<UserInfoSearch[]>([]);
  selectedItems = signal<string[]>([]);
  currentUserId= signal<string>('');
  isLoading = signal<boolean>(false)
  defaultAvatar = defaultAvatar;
  onCloseDialog(value: UserInfoSearch[]) {
    this.dynamicDialogRef.close(value);
  }

  getFriendsOfUser(keyword: string) {
    this.isLoading.set(true);
    this.userService.searchUserByKeyword(this.currentUserId(), keyword).subscribe((response)=>{
      this.isLoading.set(false);
      if(response.statusCode !== 200) {
        this.items.set([]);
        return;
      }
      this.items.set((response.data || []).map((item: UserInfoSearchResponse)=>item));
    });
  }

  searchInputChange(value: string) {
    this.getFriendsOfUser(value);
  }

  ngOnInit(): void {
    this.userUnSubscription =  this.userService.currentUserLogin.subscribe((value: UserLoginResponse)=>{
      this.currentUserId.set(value.id);
    });
    this.getFriendsOfUser('');
    this.selectedItems.set(this.dialogConfig.data.initializeTagFriends)
  }

  ngOnDestroy(): void {
    if(this.userUnSubscription) {
      this.userUnSubscription.unsubscribe();
    }
  }
}
