import { Component, inject, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CommonOption } from '@app/models/common-option.model';
import { scopePost } from '@app/constants/common.constant';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-post-dialog',
  standalone: true,
  imports: [ButtonModule, AvatarModule, InputTextareaModule, DropdownModule],
  templateUrl: './add-post-dialog.component.html',
  styleUrl: './add-post-dialog.component.scss',
  providers: [DialogService]
})
export class AddPostDialogComponent implements OnInit {
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private dialogService: DialogService = inject(DialogService);


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
}
