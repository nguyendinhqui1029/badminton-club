import { Component, computed, ElementRef, inject, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild, WritableSignal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CommonOption } from '@app/models/common-option.model';
import { scopePost } from '@app/constants/common.constant';
import { ButtonModule } from 'primeng/button';
import { UploadFileComponent } from '@app/components/upload-file/upload-file.component';
import { FileModel } from '@app/models/file-upload.model';
import { TagFriendsDialogComponent } from '@app/components/dialogs/tag-friends-dialog/tag-friends-dialog.component';
import { TagLocationDialogComponent } from '@app/components/dialogs/tag-location-dialog/tag-location-dialog.component';
import { isPlatformBrowser } from '@angular/common';
import { UserInfoSearch, UserLoginResponse } from '@app/models/user.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidatorService } from '@app/services/validators.service';
import { PostService } from '@app/services/post.service';
import { PostRequestBody, PostResponseValue } from '@app/models/post.model';
import { PickerColorComponent } from '@app/components/picker-color/picker-color.component';
import { Subscription, take } from 'rxjs';
import { UserService } from '@app/services/user.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface UserStatus { avatar: string; userName: string; feeling?: {icon: string; value: string}; friends: string[];location: string;};
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
  
  private dialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private dialogService: DialogService = inject(DialogService);
  private platformId: Object = inject(PLATFORM_ID);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private postService: PostService = inject(PostService);
  private userService: UserService = inject(UserService);
  private messageService: MessageService = inject(MessageService);

  private userUnSubscription!: Subscription;
  currentUserId= signal<string>('');

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
      scope: [post?.scope || 'Everyone']
    });
    this.selectedBackgroundClass = this.postFormGroup.value.background.replace('==/==', ' ');
    const feelingAfterSplit = (post?.feelingIcon || '==/==').split('==/==');
    this.titleGroup.set({
      avatar: post?.createdBy?.avatar || '',
      userName: post?.createdBy?.name || '',
      feeling: {
        value: feelingAfterSplit[0] || '',
        icon: feelingAfterSplit[1] || ''
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
          this.messageService.add({ severity: 'danger', summary: 'Thông báo', detail: 'Có lỗi xảy ra trong quá trình tạo. Vui lòng tạo lại.' })
          return;
        }
        this.fileUploadRef.requestChangeStatusFile(()=>{
          this.dynamicDialogRef.close();
          this.messageService.add({severity: 'success', summary: 'Thông báo', detail: 'Bài viết được tạo thành công!' })
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
        initializeTagFriends: this.postFormGroup.value.tagFriends || []
      }
    });

    if(isPlatformBrowser(this.platformId) && window.matchMedia('(max-width: 500px)').matches) {
      this.dialogService.getInstance(this.dynamicDialogTagFriendRef).maximize();
    }
    this.dynamicDialogTagFriendRef.onClose.pipe(take(1)).subscribe((value: string)=>{
      this.postFormGroup.get('tagLocation')?.setValue(value);
      this.titleGroup.update((userStatus: UserStatus)=>({...userStatus, tagLocation: value}));
    })
  }
  ngOnDestroy() {
    if (this.dynamicDialogRef) {
        this.dynamicDialogRef.close();
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
