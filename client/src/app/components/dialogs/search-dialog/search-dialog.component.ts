import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SearchContainerGroupComponent } from '@app/components/search-container-group/search-container-group.component';
import { CURRENT_USER_INIT, defaultAvatar, notificationStatus, notificationType } from '@app/constants/common.constant';
import { path } from '@app/constants/path.constant';
import { SearchByKeywordResponseValue } from '@app/models/common.model';
import { NotificationResponseValue, NotificationSocketParams } from '@app/models/notify.model';
import { DataSearchGroup } from '@app/models/search-group.model';
import { UserLoginResponse } from '@app/models/user.model';
import { CommonService } from '@app/services/common.service';
import { NotificationService } from '@app/services/notification.service';
import { UserService } from '@app/services/user.service';
import { NotificationSocket } from '@app/sockets/notification.socket';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';

interface DataSearchMapping {
  type: 'POST' | 'EVENT' | 'USER';
  name: string;
  id: string;
  avatar: string;
};

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [SearchContainerGroupComponent, AvatarModule, ButtonModule],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.scss'
})
export class SearchDialogComponent implements OnInit {
   
  private commonService: CommonService = inject(CommonService);
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private userService: UserService = inject(UserService);
  private notificationSocket: NotificationSocket = inject(NotificationSocket);
  private notificationService: NotificationService = inject(NotificationService);
  private route: Router = inject(Router);

  isLoading = signal<boolean>(false);
  items = signal<DataSearchGroup<DataSearchMapping>[]>([]);
  initializeValue = signal<string[]>([]);
  defaultAvatar = defaultAvatar;
  currentUser = signal<UserLoginResponse>(CURRENT_USER_INIT);
  friendsOfCurrentUser = signal<string[]>([]);
  addFriendsWaitingAgree = signal<string[]>([]);

  
  onCloseDialog(value: DataSearchGroup<DataSearchMapping>[]) {
    if(value.length && value[0].children[0].type === 'USER') {
      return;
    }
    if(value.length && value[0].children[0].type === 'POST') {
      this.route.navigate([`/${path.HOME.DETAIL.replace(':id', value[0].children[0].id)}`]);
    }
    if(value.length && value[0].children[0].type === 'EVENT') {
      this.route.navigate([`/${path.EVENTS.DETAIL.replace(':id', value[0].children[0].id)}`]);
    }
    this.dynamicDialogRef.close(value);
  }

  initDataSearch() {
   
  }
  getFriendsOfUser() {
    this.userService.getUserById(this.currentUser().id).subscribe((response)=>{
      this.friendsOfCurrentUser.set(response.data.idFriends || []); 
      this.addFriendsWaitingAgree.set(response.data.idWaitingConfirmAddFriends || []);
    });
  }
  ngOnInit(): void {
    this.userService.currentUserLogin.subscribe((userInfo)=>{
      this.currentUser.set(userInfo);
    });
    this.getFriendsOfUser();
    this.notificationSocket.listenNotificationEvent().subscribe((type: string)=>{
      if(type === notificationType.ADD_FRIEND) {
        this.getFriendsOfUser();
      }
    });  
  }
  onUnFriendClick(id: string) {
    forkJoin([this.notificationService.createNotification({
      read: [],
      title: `${this.currentUser().name} đã huỷ kết bạn với bạn.`,
      content: '',
      fromUser: this.currentUser().id,
      navigateToDetailUrl: '',
      to: [id],
      type: notificationType.UN_FRIEND,
    }), this.userService.unFriend({
      id: this.currentUser().id,
      idFriend: id
    })]).subscribe(([notifyResponse, _])=>{
      const params: NotificationSocketParams = {
        to: [id],
        type: notificationType.UN_FRIEND,
        notifyInfo: notifyResponse.data
      };
      this.notificationSocket.sendNotificationEvent(params);
      this.getFriendsOfUser();
    });
  }

  onAddFriendClick(id: string) {
    forkJoin([this.notificationService.createNotification({
      read: [],
      title: `${this.currentUser().name} đã gửi lời mời kết bạn đến bạn.`,
      content: '',
      fromUser: this.currentUser().id,
      navigateToDetailUrl: '',
      to: [id],
      type: notificationType.ADD_FRIEND,
    }), this.userService.addFriend({
      id: this.currentUser().id,
      idFriendWaiting: id
    })]).subscribe(([notifyResponse, _])=>{
      const params: NotificationSocketParams = {
        to: [id],
        type: notificationType.ADD_FRIEND,
        notifyInfo: notifyResponse.data
      };
      this.notificationSocket.sendNotificationEvent(params);
      this.getFriendsOfUser();
    });
  }

  searchInputChange(value: string) {
    this.isLoading.set(true);
    this.commonService.searchByKeyword(value).subscribe((response)=>{
      this.isLoading.set(false);
      if(response.statusCode !== 200 || !response.data.length) {
        this.items.set([]);
        return;
      }
      const result = [];
      const userData: SearchByKeywordResponseValue[] = [];
      const eventData: SearchByKeywordResponseValue[] = [];
      const postData: SearchByKeywordResponseValue[] = [];
      response.data.forEach((item)=>{
        if(item.type === 'USER' && item.id !== this.currentUser().id) {
          userData.push(item);
        }
        if(item.type === 'EVENT') {
          eventData.push(item);
        }
        if(item.type === 'POST') {
          postData.push(item);
        }
      });
      if(userData.length) {
        result.push({ 
          id: 'ACCOUNT', 
          groupName: 'Tài khoản',
          children: userData.map(item=>({
            type: item.type,
            name: item.name,
            id: item.id,
            avatar: item.avatar
          })),
          
        });
      }
      if(eventData.length) {
        result.push({ 
          id: 'EVENT', 
          groupName: 'Sự kiện',
          children: eventData
        });
      }
      if(postData.length) {
        result.push({ 
          id: 'POST', 
          groupName: 'Bài viết',
          children: postData
        });
      }
      this.items.set(result);
    })
  }
}
