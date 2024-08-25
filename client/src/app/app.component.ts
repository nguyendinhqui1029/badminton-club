import { afterNextRender, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { UserService } from '@app/services/user.service';
import { getUserInfoFromToken } from '@app/utils/auth.util';
import { localStorageKey } from '@app/constants/common.constant';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent {
  private userService: UserService = inject(UserService);
  title = 'client';
  breakpoints = { '920px': { width: '100%', right: '0', left: '0' } };
  constructor() {
    afterNextRender(() => {
      const currentUserLogin = getUserInfoFromToken(localStorage.getItem(localStorageKey.ACCESS_TOKEN));
      this.userService.updateData(currentUserLogin);
    });
  }
}
