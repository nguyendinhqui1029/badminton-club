import { Component, computed, EventEmitter, inject, input, OnChanges, OnDestroy, OnInit, Output, PLATFORM_ID, signal, SimpleChanges } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddPostDialogComponent } from '@app/components/dialogs/add-post-dialog/add-post-dialog.component';
import { isPlatformBrowser } from '@angular/common';
import { PostResponseValue } from '@app/models/post.model';
import { UserInfoSearch } from '@app/models/user.model';
import { take } from 'rxjs';
import { scopePost } from '@app/constants/common.constant';
import { getTimeDifference } from '@app/utils/date.util';
import { ImagesGridComponent } from '@app/components/images-grid/images-grid.component';

interface UserStatus { avatar: string; userName: string; feeling?: {icon: string; value: string}; friends: string[];location: string;};

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [AvatarModule, AvatarGroupModule, ImagesGridComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  providers: [DialogService]
})
export class CardComponent implements OnDestroy, OnInit, OnChanges {
  item = input.required<PostResponseValue>();
  @Output() refreshDataListEvent = new EventEmitter();

  
  private dialogService: DialogService = inject(DialogService);
  private platformId: Object = inject(PLATFORM_ID);
  dynamicDialogRef: DynamicDialogRef | undefined;
  
  
  titleGroup = signal<UserStatus>({
    avatar: '',
    userName: '',
    feeling: {
      value: '',
      icon: ''
    },
    friends: [],
    location: ''
  });
  backgroundClass = signal<string>('');


  scopeIcon = computed(()=> {
    const scopeIcon = {
      [scopePost.EVERYONE]: 'pi pi-users',
      [scopePost.FRIENDS]: 'pi pi-user',
      [scopePost.ONLY_ME]: 'pi pi-lock',
    }
    return scopeIcon[this.item().scope] || 'pi pi-users';
  });
  createdTime = computed(()=>getTimeDifference(new Date(this.item().createdAt)));
  userLikeAvatar = computed(()=> {
    if(this.item().idUserLike.length > 5){
      return [...this.item().idUserLike.splice(0,5), {avatar: `+${this.item().idUserLike.length}`, name:''}]
    }
    return this.item().idUserLike;
  });
  userStatusDisplay = computed(()=> {
    return this.generateUserStatus();
  });
  hasPermission = computed(()=> this.currentUserId === this.item().createdBy.id);
  currentUserId: string = '66c17a38d69f28009ab7ab88';

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['item']?.currentValue) {
      const post = changes['item']?.currentValue;
      const feelingAfterSplit = (post?.feelingIcon || '==/==').split('==/==');
      this.titleGroup.set({
        avatar: post?.createdBy?.avatar || '',
        userName: post?.createdBy?.name || '',
        feeling: {
          value: feelingAfterSplit[0] || '',
          icon: feelingAfterSplit[1] || ''
        },
        friends: (post?.tagFriends || []).map((tagFriends: UserInfoSearch)=>tagFriends.name),
        location: post?.tagLocation || ''
      })
      this.generateUserStatus();
    }
  }

  generateUserStatus() {
    let status = '';
    if(this.titleGroup()?.userName) {
      status += `<h4 class="font-bold text-lg leading-6">${this.titleGroup()?.userName}</h4>`;
    }

    if(this.titleGroup()?.feeling?.icon && this.titleGroup()?.feeling?.value) {
       status += `&nbsp;đang cảm thấy&nbsp; <strong> ${this.titleGroup()?.feeling?.value} </strong> &nbsp;${this.titleGroup()?.feeling?.icon}`;
       if(!this.titleGroup()?.location && !this.titleGroup()?.friends?.length) {
        return `${status}.`;
      }
    }

    if(this.titleGroup()?.friends?.length) {
      status += `&nbsp;cùng với&nbsp;<strong> 
            ${
              this.titleGroup()?.friends?.length < 2 
              ? this.titleGroup()?.friends[0]
              : this.titleGroup()?.friends?.length == 2 
              ? `${this.titleGroup()?.friends[0]}, ${this.titleGroup()?.friends[1]}`
              : `${this.titleGroup()?.friends[0]}, ${this.titleGroup()?.friends[1]}</strong>&nbsp;và&nbsp;<strong>${this.titleGroup()?.friends.length - 2}</strong>&nbsp;người khác`
            }`;
      if(!this.titleGroup()?.location) {
        return `${status}.`;
      }
    }
    if(this.titleGroup()?.location) {
      status += `&nbsp;tại&nbsp;<strong> ${this.titleGroup()?.location}.</strong>`;
      return status;
    }
    return status;
  }

  ngOnInit(): void {
    this.backgroundClass.set(this.item().background.replace('==/==', ' '));
  }

  onClickOpenEditPost() {
    if(this.currentUserId !== this.item().createdBy.id){
      return;
    }
    this.dynamicDialogRef = this.dialogService.open(AddPostDialogComponent, {
      showHeader: false,
      width: '450px',
      modal: true,
      transitionOptions: '450ms',
      appendTo: 'body',
      data: {
        id: this.item().id
      }
    });

    if(isPlatformBrowser(this.platformId) && window.matchMedia('(max-width: 500px)').matches) {
      this.dialogService.getInstance(this.dynamicDialogRef).maximize();
    }
    this.dynamicDialogRef.onClose.pipe(take(1)).subscribe(()=>this.refreshDataListEvent.emit())
  }

  ngOnDestroy() {
    if (this.dynamicDialogRef) {
        this.dynamicDialogRef.close();
    }
  }
}
