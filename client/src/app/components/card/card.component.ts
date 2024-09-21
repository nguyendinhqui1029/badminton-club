import { afterNextRender, Component, computed, EventEmitter, inject, input, OnChanges, OnDestroy, OnInit, Output, PLATFORM_ID, signal, SimpleChanges } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddPostDialogComponent } from '@app/components/dialogs/add-post-dialog/add-post-dialog.component';
import { isPlatformBrowser } from '@angular/common';
import { PostRequestBody, PostResponseValue } from '@app/models/post.model';
import { UserInfoSearch, UserLoginResponse } from '@app/models/user.model';
import { Subscription, take } from 'rxjs';
import { CURRENT_USER_INIT, defaultAvatar, INIT_POST_VALUE, scopePost, socialType } from '@app/constants/common.constant';
import { getTimeDifference } from '@app/utils/date.util';
import { ImagesGridComponent } from '@app/components/images-grid/images-grid.component';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { PostService } from '@app/services/post.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { UserService } from '@app/services/user.service';
import { environment } from '@app/environments/environment';
import { path } from '@app/constants/path.constant';
import { formatLargeNumber } from '@app/utils/common.util';
import { CommentDialogComponent } from '@app/components/dialogs/comment-dialog/comment-dialog.component';
import { SocketService } from '@app/services/socket.service';


interface UserStatus { avatar: string; userName: string; feeling?: { icon: string; value: string }; friends: string[]; location: string; };

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [ConfirmDialogModule, ToastModule, AvatarModule, AvatarGroupModule, MenuModule, ImagesGridComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  providers: [DialogService, PostService, ConfirmationService]
})
export class CardComponent implements OnDestroy, OnInit, OnChanges {
  item = input.required<PostResponseValue>();
  @Output() refreshDataListEvent = new EventEmitter();
  private socketService: SocketService = inject(SocketService);
  private userService: UserService = inject(UserService);
  private postService: PostService = inject(PostService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private dialogService: DialogService = inject(DialogService);
  private platformId: Object = inject(PLATFORM_ID);

  private userUnSubscription!: Subscription;

  dynamicDialogRef: DynamicDialogRef | undefined;
  dynamicCommentDialogRef: DynamicDialogRef | undefined;

  waitingLike = signal<boolean>(false);
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
  currentUser = signal<UserLoginResponse>(CURRENT_USER_INIT);
  itemClone = signal<PostResponseValue>(INIT_POST_VALUE);


  isLiked = computed(() => this.itemClone().idUserLike.find((item) => item?.id === this.currentUser().id))
  scopeIcon = computed(() => {
    const scopeIcon = {
      [scopePost.EVERYONE]: 'pi pi-users',
      [scopePost.FRIENDS]: 'pi pi-user',
      [scopePost.ONLY_ME]: 'pi pi-lock',
    }
    return scopeIcon[this.itemClone().scope] || 'pi pi-users';
  });
  createdTime = computed(() => getTimeDifference(new Date(this.itemClone().createdAt)));
  userLikeAvatar = computed(() => {
    if (this.itemClone().idUserLike.length > 5) {
      return [...this.itemClone().idUserLike.splice(0, 5), { avatar: `+${this.itemClone().idUserLike.length}`, name: '' }]
    }
    return this.itemClone().idUserLike;
  });
  userStatusDisplay = computed(() => {
    return this.generateUserStatus();
  });
  hasPermission = computed(() => this.currentUser()?.id === this.itemClone().createdBy?.id);
  actionsPost: MenuItem[] | undefined;
  actionsSharePost: MenuItem[] | undefined;
  linkPostDetail = computed(() => `/${path.HOME.DETAIL.replace(':id', this.itemClone()?.id || '')}`);
  countComment = computed(() => formatLargeNumber(this.itemClone()?.countComment));
  disableButton = computed(() => !this.currentUser().id);
  defaultAvatar = defaultAvatar;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']?.currentValue) {
      this.itemClone.set(changes['item']?.currentValue);
      const post = changes['item']?.currentValue;
      const feelingAfterSplit = (post?.feelingIcon || '==/==').split('==/==');
      this.titleGroup.set({
        avatar: post?.createdBy?.avatar || '',
        userName: post?.createdBy?.name || '',
        feeling: {
          value: feelingAfterSplit[0] || '',
          icon: feelingAfterSplit[1] || ''
        },
        friends: (post?.tagFriends || []).map((tagFriends: UserInfoSearch) => tagFriends.name),
        location: post?.tagLocation || ''
      })
      this.generateUserStatus();
    }
  }

  generateUserStatus() {
    let status = '';
    if (this.titleGroup()?.userName) {
      status += `<h4 class="font-bold text-lg leading-6">${this.titleGroup()?.userName}</h4>`;
    }

    if (this.titleGroup()?.feeling?.icon && this.titleGroup()?.feeling?.value) {
      status += `&nbsp;đang cảm thấy&nbsp; <strong> ${this.titleGroup()?.feeling?.value} </strong> &nbsp;${this.titleGroup()?.feeling?.icon}`;
      if (!this.titleGroup()?.location && !this.titleGroup()?.friends?.length) {
        return `${status}.`;
      }
    }

    if (this.titleGroup()?.friends?.length) {
      status += `&nbsp;cùng với&nbsp;<strong> 
            ${this.titleGroup()?.friends?.length < 2
          ? this.titleGroup()?.friends[0]
          : this.titleGroup()?.friends?.length == 2
            ? `${this.titleGroup()?.friends[0]}, ${this.titleGroup()?.friends[1]}`
            : `${this.titleGroup()?.friends[0]}, ${this.titleGroup()?.friends[1]}</strong>&nbsp;và&nbsp;<strong>${this.titleGroup()?.friends.length - 2}</strong>&nbsp;người khác`
        }`;
      if (!this.titleGroup()?.location) {
        return `${status}.`;
      }
    }
    if (this.titleGroup()?.location) {
      status += `&nbsp;tại&nbsp;<strong> ${this.titleGroup()?.location}.</strong>`;
      return status;
    }
    return status;
  }

  ngOnInit(): void {
    this.socketService.onPostComment().subscribe(value=>{
      if(value === this.itemClone().id) {
        this.itemClone.update((value)=>({...value, countComment: value.countComment + 1}));
      }
    })
    this.socketService.onPostLike().subscribe(value => {
      if(value.id === this.itemClone().id) {
        this.itemClone.update(()=>value);
      }
    });
    this.userUnSubscription = this.userService.currentUserLogin.subscribe((value: UserLoginResponse) => {
      this.currentUser.set(value);
    });
    this.actionsPost = [
      {
        label: 'Tính năng',
        items: [
          {
            label: 'Cập nhật',
            icon: 'text-2xl pi pi-pen-to-square',
            command: () => {
              this.onClickOpenEditPost();
            }
          },
          {
            label: 'Xoá',
            icon: 'text-2xl pi pi-upload',
            command: () => {
              this.onDeletePost();
            }
          }
        ]
      }];
    this.actionsSharePost = [
      {
        label: 'Chia sẻ',
        items: [
          {
            label: 'Facebook',
            icon: 'pi pi-facebook',
            iconClass: 'text-4xl text-blue-600',
            command: () => {
              this.shareToSocial(socialType.FACEBOOK);
            }
          },
          {
            label: 'Twitter',
            icon: 'pi pi-twitter',
            iconClass: 'flex items-center justify-center w-9 h-9 rounded-full bg-black text-white',
            command: () => {
              this.shareToSocial(socialType.TWITTER);
            }
          },
          {
            label: 'Zalo',
            icon: 'zalo-icon',
            command: () => {
              this.shareToSocial(socialType.ZALO);
            }
          },
          {
            label: 'Linkedin',
            icon: 'pi pi-linkedin',
            iconClass: 'text-3xl text-blue-500',
            command: () => {
              this.shareToSocial(socialType.LINKEDIN);
            }
          }

        ]
      }];
    this.backgroundClass.set(this.itemClone().background.replace('==/==', ' '));
  }

  onDeletePost() {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xoá bài này không?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.postService.deletePost(this.itemClone().id || '').subscribe((response) => {
          if (response.statusCode !== 200) {
            this.messageService.add({ severity: 'error', summary: 'Thông báo xoá', detail: 'Bài viết chưa được xoá. Vui lòng thử lại.' })
            return;
          }
          this.refreshDataListEvent.emit();
          this.messageService.add({ severity: 'success', summary: 'Xác nhận', detail: 'Xoá thành công.' });
        });
      },
      reject: () => {
        return
      }
    });
  }

  onClickOpenEditPost() {
    if (this.currentUser().id !== this.itemClone().createdBy?.id) {
      return;
    }
    this.dynamicDialogRef = this.dialogService.open(AddPostDialogComponent, {
      showHeader: false,
      width: '450px',
      modal: true,
      transitionOptions: '450ms',
      appendTo: 'body',
      data: {
        id: this.itemClone().id
      }
    });

    if (isPlatformBrowser(this.platformId) && window.matchMedia('(max-width: 500px)').matches) {
      this.dialogService.getInstance(this.dynamicDialogRef).maximize();
    }
    this.dynamicDialogRef.onClose.pipe(take(1)).subscribe(() => this.refreshDataListEvent.emit())
  }

  shareToSocial(type: string) {
    let linkPost = encodeURIComponent(`${environment.domain}/detail/${this.itemClone().id}`);
    const title = this.itemClone().content;
    const urlByType = {
      [socialType.FACEBOOK]: `https://www.facebook.com/sharer/sharer.php?u=${linkPost}`,
      [socialType.LINKEDIN]: `https://www.linkedin.com/sharing/share-offsite/?url=${linkPost}`,
      [socialType.TWITTER]: `https://twitter.com/intent/tweet?url=${linkPost}&text=${title}`,
      [socialType.ZALO]: `https://chat.zalo.me/?app=browser&url=${linkPost}&title=${title}`
    }
    window.open(urlByType[type] || urlByType[socialType.FACEBOOK], '_blank');
  }

  onClickLike() {
    if (this.waitingLike() || this.disableButton()) {
      return;
    }
    this.waitingLike.set(true);
    const index = this.itemClone().idUserLike.findIndex((item) => item?.id === this.currentUser().id);
    const userLikeClone = [...this.itemClone().idUserLike];
    if (index === -1) {
      userLikeClone.unshift(this.currentUser())
    } else {
      userLikeClone.splice(index, 1);
    }
    const body: PostRequestBody = {
      id: this.itemClone()?.id || '',
      images: this.itemClone()?.images || [],
      background: this.itemClone()?.background || '',
      content: this.itemClone()?.content || '',
      hashTag: this.itemClone()?.hashTag || [],
      idUserLike: (userLikeClone || []).map((item) => item.id),
      countComment: this.itemClone()?.countComment || 0,
      shareLink: (this.itemClone()?.shareLink || []).map((item) => item.id),
      tagFriends: (this.itemClone()?.tagFriends || []).map((item) => item.id),
      tagLocation: this.itemClone()?.tagLocation || '',
      feelingIcon: this.itemClone()?.feelingIcon || '',
      createdBy: this.itemClone()?.createdBy?.id,
      scope: this.itemClone().scope
    };
    this.postService.updatePost(this.itemClone().id || '', body).subscribe((response) => {
      this.waitingLike.set(false);
      if (response.statusCode !== 200) {
        return;
      }
      this.itemClone.set(response.data);
      this.socketService.sendPostLike(this.itemClone());
    });
  }

  onClickComment() {
    if (!this.currentUser()?.id) {
      return;
    }

    this.dynamicCommentDialogRef = this.dialogService.open(CommentDialogComponent, {
      showHeader: false,
      width: '450px',
      modal: true,
      transitionOptions: '450ms',
      appendTo: 'body',
      data: {
        id: this.itemClone().id
      }
    });

    if (isPlatformBrowser(this.platformId) && window.matchMedia('(max-width: 500px)').matches) {
      this.dialogService.getInstance(this.dynamicCommentDialogRef).maximize();
    }
    this.dynamicCommentDialogRef.onClose.pipe(take(1)).subscribe((countComment: number) => {
      this.itemClone.update(value => ({ ...value, countComment }));
    })
  }
  ngOnDestroy() {
    if (this.dynamicDialogRef) {
      this.dynamicDialogRef.close();
    }

    if (this.dynamicCommentDialogRef) {
      this.dynamicCommentDialogRef.close();
    }

    if (this.userUnSubscription) {
      this.userUnSubscription.unsubscribe();
    }
  }
}

