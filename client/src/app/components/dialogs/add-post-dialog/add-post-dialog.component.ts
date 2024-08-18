import { Component, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CommonOption } from '@app/models/common-option.model';
import { scopePost } from '@app/constants/common.constant';
import { ButtonModule } from 'primeng/button';
import { UploadFileComponent } from '@app/components/upload-file/upload-file.component';
import { FileModel } from '@app/models/file-upload.model';
import { TagFriendsDialogComponent } from '@app/components/dialogs/tag-friends-dialog/tag-friends-dialog.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-add-post-dialog',
  standalone: true,
  imports: [ButtonModule, AvatarModule, InputTextareaModule, DropdownModule, UploadFileComponent],
  templateUrl: './add-post-dialog.component.html',
  styleUrl: './add-post-dialog.component.scss',
  providers: [DialogService]
})
export class AddPostDialogComponent implements OnInit, OnDestroy {
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogTagFriendRef: DynamicDialogRef = inject(DynamicDialogRef);

  private dialogService: DialogService = inject(DialogService);
  private platformId: Object = inject(PLATFORM_ID);

  title: string = 'Tạo bài viết';
  placeholder: string = 'Hôm nay bạn muốn chia sẻ gì?';
  postScopeOptions: CommonOption[] = [
    { label: 'Mọi người', value: scopePost.EVERYONE },
    { label: 'Bạn bè', value: scopePost.FRIENDS },
    { label: 'Riêng tôi', value: scopePost.ONLY_ME },
  ];
  backgroundConfigOptions: CommonOption[] = [
    { label: 'bg-gray-color-20', value: 'placeholder:text-black-100 text-black'},
    { label: 'bg-vivid_purple', value: ' text-white placeholder:text-gray-200'},
    { label: 'bg-red-color', value: 'text-white placeholder:text-gray-200'},
    { label: 'bg-very_dark_black', value: 'text-white placeholder:text-gray-200'},
    { label: 'bg-gradient-to-b from-vivid_red to-deep_blue', value: 'text-white placeholder:text-gray-200'},
    { label: 'bg-gradient-to-b from-royal_blue to-neon_pink', value: 'text-white placeholder:text-gray-200'},
    { label: 'bg-yellow-to-red', value: 'text-white placeholder:text-gray-200'},
    { label: 'bg-gradient-to-b from-slate_gray to-gunmetal_gray', value: 'text-white placeholder:text-gray-200'},
    { label: 'bg-badminton', value: 'text-vivid_purple placeholder:text-gray-200'},
    { label: 'bg-white_to_pink', value: 'text-black'},
  ];
  selectedBackground: CommonOption = this.backgroundConfigOptions[0];

  images = signal<FileModel[]>([]);
  
  ngOnInit(): void {
    this.dialogService
  }

  onClickCloseDialog() {
    this.dynamicDialogRef.close();
  }

  onClickSelectBackground(item: CommonOption) {
    this.selectedBackground = item;
  }

  onClickSubmit() {
    console.log('onClickSubmit')
  }

  openTagFriendDialog() {
    this.dynamicDialogTagFriendRef = this.dialogService.open(TagFriendsDialogComponent, {
      showHeader: false,
      width: '450px',
      height: '100vh',
      modal: true,
      transitionOptions: '450ms',
      appendTo: 'body'
    });

    if(isPlatformBrowser(this.platformId) && window.matchMedia('(max-width: 500px)').matches) {
      this.dialogService.getInstance(this.dynamicDialogTagFriendRef).maximize();
    }
  }

  ngOnDestroy() {
    if (this.dynamicDialogRef) {
        this.dynamicDialogRef.close();
    }
    if (this.dynamicDialogTagFriendRef) {
      this.dynamicDialogTagFriendRef.close();
    } 
  }
}
