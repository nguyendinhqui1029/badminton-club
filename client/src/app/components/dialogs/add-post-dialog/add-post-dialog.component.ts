import { Component, computed, inject, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild, WritableSignal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CommonOption } from '@app/models/common-option.model';
import { defaultAvatar, notificationType, scopePost } from '@app/constants/common.constant';
import { ButtonModule } from 'primeng/button';
import { UploadFileComponent } from '@app/components/upload-file/upload-file.component';
import { FileModel } from '@app/models/file-upload.model';
import { TagFriendsDialogComponent } from '@app/components/dialogs/tag-friends-dialog/tag-friends-dialog.component';
import { TagLocationDialogComponent } from '@app/components/dialogs/tag-location-dialog/tag-location-dialog.component';
import { isPlatformBrowser } from '@angular/common';
import { FeelingValue, UserInfoSearch, UserLoginResponse } from '@app/models/user.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidatorService } from '@app/services/validators.service';
import { PostService } from '@app/services/post.service';
import { PostRequestBody, PostResponseValue } from '@app/models/post.model';
import { PickerColorComponent } from '@app/components/picker-color/picker-color.component';
import { forkJoin, Subscription, switchMap, take } from 'rxjs';
import { UserService } from '@app/services/user.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagFeelingDialogComponent } from '@app/components/dialogs/tag-feeling-dialog/tag-feeling-dialog.component';
import { DataSearchGroup } from '@app/models/search-group.model';
import { PostSocketService } from '@app/services/sockets/post-socket.service';
import { NotificationSocketService } from '@app/services/sockets/notification-socket.service';
import { NotificationService } from '@app/services/notification.service';
import { path } from '@app/constants/path.constant';
import { ServiceWorkerService } from '@app/services/service-worker.service';

interface UserStatus { avatar: string; userName: string; feeling?: {id: string; icon: string; value: string}; friends: string[];location: string;};
@Component({
  selector: 'app-add-post-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule, 
    AvatarModule, 
    InputTextareaModule, 
    DropdownModule, 
    UploadFileComponent,
    PickerColorComponent,
    ToastModule],
  templateUrl: './add-post-dialog.component.html',
  styleUrl: './add-post-dialog.component.scss',
  providers: [DialogService]
})
export class AddPostDialogComponent implements OnInit, OnDestroy {
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogTagFriendRef: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogTagLocationRef: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogTagFeelingRef: DynamicDialogRef = inject(DynamicDialogRef);

  private dialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private dialogService: DialogService = inject(DialogService);
  private platformId: Object = inject(PLATFORM_ID);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private postService: PostService = inject(PostService);
  private userService: UserService = inject(UserService);
  private postSocketService: PostSocketService = inject(PostSocketService);
  private notificationSocketService: NotificationSocketService = inject(NotificationSocketService);
  private messageService: MessageService = inject(MessageService);
  private notificationService: NotificationService = inject(NotificationService);
  private serviceWorkerService: ServiceWorkerService = inject(ServiceWorkerService);

  private userUnSubscription!: Subscription;
  currentUserId= signal<string>('');
  friendOfCurrentUser= signal<string[]>([]);
  defaultAvatar = defaultAvatar;

  @ViewChild('fileUploadRef', {static: false}) fileUploadRef!: UploadFileComponent;
  
  images = signal<FileModel[]>([]);

  title: string = 'Tạo bài viết';
  buttonSubmitTitle: string = 'Đăng bài';
  placeholder: string = 'Hôm nay bạn muốn chia sẻ gì?';
  postScopeOptions: CommonOption[] = [
    { label: 'Mọi người', value: scopePost.EVERYONE },
    { label: 'Bạn bè', value: scopePost.FRIENDS },
    { label: 'Riêng tôi', value: scopePost.ONLY_ME },
  ];
  selectedBackgroundClass: string = '';
  postFormGroup!: FormGroup;
  userStatusDisplay = computed(()=> {
    return this.generateUserStatus(this.titleGroup);
  });
  titleGroup = signal<UserStatus>({
    avatar: '',
    userName: '',
    feeling: {
      id: '',
      value: '',
      icon: ''
    },
    friends: [],
    location: ''
  });
  idPost: string| null = null;

  generateUserStatus(titleGroup: WritableSignal<UserStatus>) {
      let status = '';
      if(titleGroup()?.userName) {
        status += `<h4 class="font-bold text-lg">${titleGroup()?.userName}</h4>`;
      }
      if(titleGroup()?.feeling?.icon && titleGroup()?.feeling?.value) {
         status += `&nbsp;đang cảm thấy&nbsp; <strong> ${titleGroup()?.feeling?.value} </strong> &nbsp;${titleGroup()?.feeling?.icon}`;
         if(!titleGroup()?.location && !titleGroup()?.friends?.length) {
          return `${status}.`;
        }
      }

      if(titleGroup()?.friends?.length) {
        status += `&nbsp;cùng với&nbsp;<strong> 
              ${
                titleGroup()?.friends?.length < 2 
                ? titleGroup()?.friends[0]
                : titleGroup()?.friends?.length == 2 
                ? `${titleGroup()?.friends[0]}, ${titleGroup()?.friends[1]}`
                : `${titleGroup()?.friends[0]}, ${titleGroup()?.friends[1]}</strong>&nbsp;và&nbsp;<strong>${titleGroup()?.friends.length - 2}</strong>&nbsp;người khác`
              }`;
        if(!titleGroup()?.location) {
          return `${status}.`;
        }
      }
      if(titleGroup()?.location) {
        status += `&nbsp;tại&nbsp;<strong> ${titleGroup()?.location}.</strong>`;
        return status;
      }
      return status;
  }

  initFormData(post?: PostResponseValue) {
    this.postFormGroup = this.formBuilder.group({
      createdBy: [post?.createdBy?.id || this.currentUserId()],
      images: [post?.images || []],
      background: [post?.background || 'bg-gray-color-20==/==placeholder:text-black-100 text-black'],
      content: [post?.content || '', [ValidatorService.fieldRequired('field_required_message')]],
      hashTag: [post?.hashTag || []],
      tagFriends: [(post?.tagFriends || []).map((item)=>item.id)],
      tagLocation: [post?.tagLocation || ''],
      feelingIcon: [post?.feelingIcon || ''],
      scope: [post?.scope || scopePost.EVERYONE]
    });
    this.selectedBackgroundClass = this.postFormGroup.value.background.replace('==/==', ' ');
    const feelingAfterSplit = (post?.feelingIcon || '==/==').split('==/==');
    this.titleGroup.set({
      avatar: post?.createdBy?.avatar || '',
      userName: post?.createdBy?.name || '',
      feeling: {
        id: feelingAfterSplit[0],
        value: feelingAfterSplit[1] || '',
        icon: feelingAfterSplit[2] || ''
      },
      friends: (post?.tagFriends || []).map((item)=>item.name),
      location: post?.tagLocation || ''
    });
  }
  
  ngOnInit(): void {
    this.initFormData();
    this.userUnSubscription =  this.userService.currentUserLogin.subscribe((userResponse: UserLoginResponse)=>{
      this.currentUserId.set(userResponse.id);
      this.initFormData();
      this.titleGroup.set({...this.titleGroup(), avatar: userResponse.avatar, userName: userResponse.name});
    });
    this.idPost = this.dialogConfig.data['id'] || null;
    this.postFormGroup.get('background')?.valueChanges.subscribe((value: string)=>{
      this.selectedBackgroundClass = value.replace('==/==', ' ');
    });
    if(this.idPost) {
      this.title = 'Chỉnh sữa bài viết';
      this.buttonSubmitTitle= 'Sữa bài';
      this.postService.getPostById(this.idPost).subscribe((response)=>{
        if(response.statusCode !== 200){
          return;
        }
        this.initFormData(response.data);
        this.postFormGroup.get('background')?.valueChanges.subscribe((value: string)=>{
          this.selectedBackgroundClass = value.replace('==/==', ' ');
        });
      })
      return;
    }
    this.userService.getUserById(this.currentUserId()).subscribe(response=>this.friendOfCurrentUser.set(response.data.idFriends || []));
  }

  onClickCloseDialog() {
    this.dynamicDialogRef.close();
  }


  initRequestBody() {
    const body: PostRequestBody = {
      images: this.postFormGroup.value.images || [],
      background: this.postFormGroup.value.background || '',
      content: this.postFormGroup.value.content || '',
      hashTag: this.postFormGroup.value.hashTag || [],
      tagFriends: this.postFormGroup.value.tagFriends || [],
      tagLocation: this.postFormGroup.value.tagLocation || '',
      feelingIcon: this.postFormGroup.value.feelingIcon || '',
      scope: this.postFormGroup.value.scope || 'Everyone',
      createdBy: this.postFormGroup.value.createdBy || '',
  };
  return body;
  }

  onClickSubmit() {
    if(this.postFormGroup.valid) {
      (this.idPost ? this.postService.updatePost(this.idPost,this.initRequestBody()) : this.postService.createPost(this.initRequestBody())).subscribe((response)=>{
        if(response.statusCode !== 200) {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Có lỗi xảy ra trong quá trình tạo. Vui lòng tạo lại.' })
          return;
        }
        this.fileUploadRef.requestChangeStatusFile(()=>{
          if(response.data.scope === scopePost.ONLY_ME) {
            this.postSocketService.sendPostChange(response.data,[this.currentUserId()]);
          }
          if(response.data.scope === scopePost.EVERYONE) {
            this.postSocketService.sendPostChange(response.data,[]);
          }
          if(response.data.scope === scopePost.FRIENDS) {
            this.postSocketService.sendPostChange(response.data,this.friendOfCurrentUser());
          }
          if(response.data.scope === scopePost.EVERYONE || response.data.scope === scopePost.FRIENDS) {
            this.notificationService.createNotification({
              read: [],
              title: `${this.titleGroup().userName} vừa chia sẻ một bài viết mới.`,
              content: response.data.content,
              fromUser: this.currentUserId(),
              navigateToDetailUrl: path.HOME.DETAIL.replace(':id', response.data.id!),
              to:  response.data.scope === scopePost.FRIENDS ? this.friendOfCurrentUser() : null,
              type: notificationType.POST
            }).subscribe((response) =>{
                this.notificationSocketService.sendNotification(response.data.to);
                const body = { ids: response.data.to, body: { title: 'Thông báo', body: `${response.data.fromUser} vừa chia sẻ mội bài viết mới`, icon: '', url: `/home/${response.data.id}` } };
                this.serviceWorkerService.sendNotification(body).subscribe();
              })
          }
         
          this.messageService.add({severity: 'success', summary: 'Thông báo', detail: 'Bài viết được tạo thành công!' });
          this.dynamicDialogRef.close();
        })
      });
    }
  }


  onFileChangeEvent(value:FileModel[]) {
    this.postFormGroup.get('images')?.setValue(value.map((item: FileModel)=>item.linkCDN))
  }

  openTagFriendDialog() {
    this.dynamicDialogTagFriendRef = this.dialogService.open(TagFriendsDialogComponent, {
      showHeader: false,
      width: '450px',
      height: '100vh',
      modal: true,
      transitionOptions: '450ms',
      appendTo: 'body',
      data: {
        initializeTagFriends: this.postFormGroup.value.tagFriends || []
      }
    });

    if(isPlatformBrowser(this.platformId) && window.matchMedia('(max-width: 500px)').matches) {
      this.dialogService.getInstance(this.dynamicDialogTagFriendRef).maximize();
    }
    this.dynamicDialogTagFriendRef.onClose.pipe(take(1)).subscribe((value: UserInfoSearch[])=>{
      this.postFormGroup.get('tagFriends')?.setValue(value.map((item:UserInfoSearch)=>item.id));
      this.titleGroup.update((userStatus: UserStatus)=>({...userStatus, friends: value.map((item:UserInfoSearch)=>item.name)}));
    })
  }

  openTagLocationDialog() {
    this.dynamicDialogTagFriendRef = this.dialogService.open(TagLocationDialogComponent, {
      showHeader: false,
      width: '450px',
      height: '100vh',
      modal: true,
      transitionOptions: '450ms',
      appendTo: 'body',
      data: {
        initializeTagLocation: this.postFormGroup.value.tagLocation || []
      }
    });

    if(isPlatformBrowser(this.platformId) && window.matchMedia('(max-width: 500px)').matches) {
      this.dialogService.getInstance(this.dynamicDialogTagFriendRef).maximize();
    }
    this.dynamicDialogTagFriendRef.onClose.pipe(take(1)).subscribe((value: {id: string; name: string}[])=>{
      if(value && value.length){
        console.log(value)
        this.postFormGroup.get('tagLocation')?.setValue(value[0].name);
        this.titleGroup.update((userStatus: UserStatus)=>({...userStatus, location: value[0].name}));
      }
    })
  }

  openTagFeelingDialog() {
    const feelingSplit = (this.postFormGroup.value?.feelingIcon as string).split('==/==');
    this.dynamicDialogTagFeelingRef = this.dialogService.open(TagFeelingDialogComponent, {
      showHeader: false,
      width: '450px',
      height: '100vh',
      modal: true,
      transitionOptions: '450ms',
      appendTo: 'body',
      data: {
        initializeTagFeeling:feelingSplit?.[0] ? [feelingSplit[0]] : []
      }
    });

    if(isPlatformBrowser(this.platformId) && window.matchMedia('(max-width: 500px)').matches) {
      this.dialogService.getInstance(this.dynamicDialogTagFeelingRef).maximize();
    }
    this.dynamicDialogTagFeelingRef.onClose.pipe(take(1)).subscribe((value: DataSearchGroup<FeelingValue>[])=>{
      if(!value.length) {
        return;
      }
      this.postFormGroup.get('feelingIcon')?.setValue(`${value[0].children[0].id}==/==${value[0].children[0].name}==/==${value[0].children[0].icon}`);
      this.titleGroup.update((userStatus: UserStatus)=>({...userStatus, feeling: {
        id: value[0].children[0].id,
        value: value[0].children[0].name.toLocaleLowerCase(),
        icon: value[0].children[0].icon
      }}));
      console.log(this.titleGroup())
    })
    
  }
  ngOnDestroy() {
    if (this.dynamicDialogRef) {
        this.dynamicDialogRef.close();
    }
    if (this.dynamicDialogTagFeelingRef) {
      this.dynamicDialogTagFeelingRef.close();
  }
    if (this.dynamicDialogTagLocationRef) {
      this.dynamicDialogTagLocationRef.close();
    } 
    if (this.dynamicDialogTagFriendRef) {
      this.dynamicDialogTagFriendRef.close();
    } 
    if(this.userUnSubscription) {
      this.userUnSubscription.unsubscribe();
    }
  }
}
