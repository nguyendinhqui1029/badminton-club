import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SearchContainerGroupComponent } from '@app/components/search-container-group/search-container-group.component';
import { CURRENT_USER_INIT, defaultAvatar } from '@app/constants/common.constant';
import { path } from '@app/constants/path.constant';
import { DataSearchGroup } from '@app/models/search-group.model';
import { UserLoginResponse } from '@app/models/user.model';
import { CommonService } from '@app/services/common.service';
import { UserService } from '@app/services/user.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

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
  private route: Router = inject(Router);

  isLoading = signal<boolean>(false);
  items = signal<DataSearchGroup<DataSearchMapping>[]>([]);
  initializeValue = signal<string[]>([]);
  defaultAvatar = defaultAvatar;
  currentUser = signal<UserLoginResponse>(CURRENT_USER_INIT);
  friendsOfCurrentUser=signal<string[]>([])

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

  ngOnInit(): void {
    this.userService.currentUserLogin.subscribe((userInfo)=>{
      this.currentUser.set(userInfo);
    });
    this.userService.getUserById(this.currentUser().id).subscribe((response)=>{
      this.friendsOfCurrentUser.set(response.data.idFriends); 
    });
  }

  onAddFriendClick(id: string) {
    const tempList = [...this.friendsOfCurrentUser()];
    const index = tempList.findIndex((item)=> item === id);
    if(index !== -1) {
      tempList.splice(index, 1); 
    }else {
      tempList.push(id);
    }
    this.userService.addFriend({id: this.currentUser().id, idFriends: tempList}).subscribe((response)=>{
      if(response.statusCode !== 200) {
        return;
      }
      this.friendsOfCurrentUser.set(response.data.idFriends);
    });
  }

  searchInputChange(value: string) {
    this.isLoading.set(true);
    this.commonService.searchByKeyword(value).subscribe((response)=>{
      this.isLoading.set(false);
      if(response.statusCode !== 200) {
        this.items.set([]);
        return;
      }
      if(!response.data.length) {
        this.items.set([]);
      }
      const result = [];
      const userData = response.data.filter((item)=>item.type === 'USER' && item.id !== this.currentUser().id);
      if(userData.length) {
        result.push({ 
          id: 'ACCOUNT', 
          groupName: 'Tài khoản',
          children: userData
        });
      }
      const eventData = response.data.filter((item)=>item.type === 'EVENT');
      if(eventData.length) {
        result.push({ 
          id: 'EVENT', 
          groupName: 'Sự kiện',
          children: eventData
        });
      }
      const postData = response.data.filter((item)=>item.type === 'POST');
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
