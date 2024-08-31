import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, PLATFORM_ID, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddPostDialogComponent } from '@app/components/dialogs/add-post-dialog/add-post-dialog.component';
import { isPlatformBrowser } from '@angular/common';
import { Subscription, take } from 'rxjs';
import { CURRENT_USER_INIT, defaultAvatar } from '@app/constants/common.constant';
import { UserLoginResponse } from '@app/models/user.model';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [AvatarModule, InputTextModule, DynamicDialogModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss',
  providers: [DialogService]
})
export class CreatePostComponent implements OnInit, OnDestroy {

  @Output() refreshDataListEvent = new EventEmitter();

  private dialogService: DialogService = inject(DialogService);
  private userService: UserService = inject(UserService);
  private platformId: Object = inject(PLATFORM_ID);
  private userLoginSubscription!: Subscription;
  dynamicDialogRef: DynamicDialogRef | undefined;
  defaultAvatar = defaultAvatar;
  currentUser = signal<UserLoginResponse>(CURRENT_USER_INIT);

  ngOnInit(): void {
    this.userLoginSubscription = this.userService.currentUserLogin.subscribe((value: UserLoginResponse) => this.currentUser.set(value));
  }

  onClickInput() {
    this.dynamicDialogRef = this.dialogService.open(AddPostDialogComponent, {
      showHeader: false,
      width: '450px',
      modal: true,
      transitionOptions: '450ms',
      appendTo: 'body',
      data: {
        id: null
      }
    });

    if (isPlatformBrowser(this.platformId) && window.matchMedia('(max-width: 500px)').matches) {
      this.dialogService.getInstance(this.dynamicDialogRef).maximize();
    }
    this.dynamicDialogRef.onClose.pipe(take(1)).subscribe(() => this.refreshDataListEvent.emit())
  }

  ngOnDestroy() {
    if (this.dynamicDialogRef) {
      this.dynamicDialogRef.close();
    }

    if (this.userLoginSubscription) {
      this.userLoginSubscription.unsubscribe();
    }
  }
}
