import { PostResponseValue } from '@app/models/post.model';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '@app/components/card/card.component';
import { CreatePostComponent } from '@app/components/create-post/create-post.component';
import { PostService } from '@app/services/post.service';
import { UserService } from '@app/services/user.service';
import { UserLoginResponse } from '@app/models/user.model';
import { CURRENT_USER_INIT } from '@app/constants/common.constant';
import { ButtonModule } from 'primeng/button';
import { path } from '@app/constants/path.constant';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoadingComponent } from '@app/components/loading/loading.component';
import { SocketService } from '@app/services/socket.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ButtonModule, CreatePostComponent, CardComponent, LoadingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private userService: UserService = inject(UserService);
  private postService: PostService = inject(PostService);
  private socketService: SocketService = inject(SocketService);

  private title: Title = inject(Title);

  posts = signal<PostResponseValue[]>([]);
  currentUserLogin = signal<UserLoginResponse>(CURRENT_USER_INIT);
  loginPage = `/${path.LOGIN.ROOT}`;
  isLoading = signal<boolean>(true);

  getDataList() {
    this.postService.getAllPost().subscribe((response)=>{
      if(response.statusCode !== 200) {
        return;
      }
      this.posts.update(()=>[...response.data]);
      this.isLoading.set(false);
    });
  }
  ngOnInit(): void {
    this.title.setTitle('Trang chủ');
    this.userService.currentUserLogin.subscribe((userInfo)=>{
      this.currentUserLogin.set(userInfo);
    })
    this.socketService.onPostDelete().subscribe((idPost: string) => {
      this.posts.update(value  => {
        const index = value.findIndex(item=>item.id === idPost);
        if(index === -1) return value;
     
        value.splice(index,1);
        return value;
      });
    });
    this.getDataList();
  }

  handleReFreshDataList() {
    setTimeout(() => {
      this.getDataList();
    }, 1000);
  }
}
