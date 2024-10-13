import { afterNextRender, Component, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { Router, RouterModule } from '@angular/router';
import { path } from '@app/constants/path.constant';
import { UserLoginResponse } from '@app/models/user.model';
import { UserService } from '@app/services/user.service';
import { Subscription, take } from 'rxjs';
import { CURRENT_USER_INIT, defaultAvatar, localStorageKey } from '@app/constants/common.constant';
import { FormatLargeNumberPipe } from '@app/pipes/format-large-number.pipe';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { isPlatformBrowser } from '@angular/common';
import { SearchDialogComponent } from '@app/components/dialogs/search-dialog/search-dialog.component';
import { LogoComponent } from '@app/components/logo/logo.component';
import { NotificationService } from '@app/services/notification.service';
import { NotificationSocket } from '@app/sockets/notification.socket';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [LogoComponent, AvatarModule, RouterModule, FormatLargeNumberPipe],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  providers: [DialogService, DynamicDialogRef]
})
export class NavigationComponent implements OnInit, OnDestroy {

  link = path;
  private userUnSubscription!: Subscription;
  private route: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private notificationService: NotificationService = inject(NotificationService);
  private dynamicSearchDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private notificationSocket: NotificationSocket = inject(NotificationSocket);

  private dialogService: DialogService = inject(DialogService);
  private platformId: Object = inject(PLATFORM_ID);

  currentUser = signal<UserLoginResponse>(CURRENT_USER_INIT);
  defaultAvatar = defaultAvatar;
  countNotifyUnread = signal<number>(0);


  constructor() {
    afterNextRender(() => {
      this.getAllNotification();
    });
  }

  getAllNotification() {
    const params = {
      idUser: this.userService.currentUserLogin.getValue().id,
      limit: 1000,
      page: 1
    }
    this.notificationService.getAllNotificationToUser(params).subscribe(response=>{
      if(response.statusCode !== 200) {
        return;
      }
      this.notificationService.updateNewNotification(response.data || []);
    })
  }
  ngOnInit(): void {
    this.notificationSocket.listenNotificationEvent().subscribe(()=>{
      this.getAllNotification();
    });
    this.notificationService.getNewNotification.subscribe(newNotification=>{
      this.countNotifyUnread.set(newNotification.filter(item=>!item.isRead).length)
    })
    this.userUnSubscription = this.userService.currentUserLogin.subscribe((value: UserLoginResponse) => {
      this.currentUser.set(value);
    });
  }

  onLogoutClick() {
    this.userService.logout().subscribe(()=>{
      localStorage.removeItem(localStorageKey.ACCESS_TOKEN);
      localStorage.removeItem(localStorageKey.REFRESH_TOKEN);
      this.userService.updateData(CURRENT_USER_INIT);
      document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      this.route.navigate([`/${path.HOME.ROOT}`]);
    });
  }

  ngOnDestroy(): void {
    if (this.userUnSubscription) {
      this.userUnSubscription.unsubscribe();
    }
  }

  handleOpenDialogSearch() {
    this.dynamicSearchDialogRef = this.dialogService.open(SearchDialogComponent, {
      showHeader: false,
      width: '450px',
      height: '100vh',
      modal: true,
      transitionOptions: '450ms',
      appendTo: 'body'
    });

    if(isPlatformBrowser(this.platformId) && window.matchMedia('(max-width: 500px)').matches) {
      this.dialogService.getInstance(this.dynamicSearchDialogRef).maximize();
    }
  }
}
