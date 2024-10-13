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
import { PostSocket } from '@app/sockets/post.socket';

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
  private postSocket: PostSocket = inject(PostSocket);

  private title: Title = inject(Title);

  posts = signal<PostResponseValue[]>([]);
  currentUserLogin = signal<UserLoginResponse>(CURRENT_USER_INIT);
  loginPage = `/${path.LOGIN.ROOT}`;
  isLoading = signal<boolean>(false);

  getDataList() {
    this.isLoading.set(true);
    this.postService.getAllPost(this.currentUserLogin().id).subscribe((response)=>{
      if(response.statusCode !== 200) {
        return;
      }
      this.posts.update(()=>[...response.data]);
      this.isLoading.set(false);
    });
  }
  ngOnInit(): void {
    this.title.setTitle('Trang chủ');
    if(!this.posts().length) {
      this.getDataList();
    }

    // Listen User Login Update
    this.userService.currentUserLogin.subscribe((userInfo: UserLoginResponse)=>{
      this.currentUserLogin.set(userInfo);
      if(!this.posts().length) {
        this.getDataList();
      }
    });

    // Listen Delete Post 
    this.postSocket.listenDeletePostEvent().subscribe((post: PostResponseValue) => {
      this.posts.update(value  => {
        const index = value.findIndex(item=>item.id === post.id);
        if(index === -1) return value;
     
        value.splice(index,1);
        return value;
      });
    });

    // Listen Add Post
    this.postSocket.listenAddPostEvent().subscribe((post: PostResponseValue)=>{
      this.posts.update(value  => {
        const index = value.findIndex(item=>item.id === post.id);
        if(index === -1) {
          value.unshift(post);
          return value;
        }
     
        value[index]=post;
        return value;
      });
    });
    
    // Listen Update Post
    this.postSocket.listenUpdatePostEvent().subscribe((post: PostResponseValue)=>{
      this.posts.update(value  => {
        const index = value.findIndex(item=>item.id === post.id);
        if(index === -1) {
          return value;
        }
     
        value[index]=post;
        return value;
      });
    });

    // Listen Like Post
    this.postSocket.listenLikePostEvent().subscribe((post: PostResponseValue)=>{
      this.posts.update(value  => {
        const index = value.findIndex(item=>item.id === post.id);
        if(index === -1) {
          return value;
        }
     
        value[index]=post;
        return value;
      });
    });
  }
}
