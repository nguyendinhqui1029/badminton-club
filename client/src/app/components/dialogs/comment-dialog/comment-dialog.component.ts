import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentsComponent } from '@app/components/comments/comments.component';
import { EnterCommentComponent } from '@app/components/enter-comment/enter-comment.component';
import { ImagesGridComponent } from '@app/components/images-grid/images-grid.component';
import { CURRENT_USER_INIT, defaultAvatar, INIT_POST_VALUE, scopePost } from '@app/constants/common.constant';
import { CommentItem, CommentResponseValue } from '@app/models/comment.model';
import { PostResponseValue } from '@app/models/post.model';
import { UserLoginResponse } from '@app/models/user.model';
import { CommentService } from '@app/services/comment.service';
import { PostService } from '@app/services/post.service';
import { UserService } from '@app/services/user.service';
import { PostSocket } from '@app/sockets/post.socket';
import { formatLargeNumber } from '@app/utils/common.util';
import { getTimeDifference } from '@app/utils/date.util';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
interface UserStatus { avatar: string; userName: string; feeling?: { id: string; icon: string; value: string }; friends: string[]; location: string; };


@Component({
  selector: 'app-comment-dialog',
  standalone: true,
  imports: [ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    AvatarModule,
    ImagesGridComponent,
    CommentsComponent,
    EnterCommentComponent
  ],
  templateUrl: './comment-dialog.component.html',
  styleUrl: './comment-dialog.component.scss'
})
export class CommentDialogComponent implements OnInit {
  private postService: PostService = inject(PostService);
  private postSocket: PostSocket = inject(PostSocket);
  private userService: UserService = inject(UserService);
  private dialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private commentService: CommentService = inject(CommentService);

  defaultAvatar = defaultAvatar;
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
  commentNumber = signal<number>(0);
  comments = signal<CommentItem[]>([]);
  backgroundClass = signal<string>('');
  itemClone = signal<PostResponseValue>(INIT_POST_VALUE);
  currentUser = signal<UserLoginResponse>(CURRENT_USER_INIT);
  createdTime = computed(() => getTimeDifference(new Date(this.itemClone().createdAt)));
  currentUserId = computed(() => this.currentUser().id);
  idPost = computed(() => this.itemClone().id || '');
  userStatusDisplay = computed(() => {
    return this.generateUserStatus();
  });
  countComment = computed(()=>formatLargeNumber(this.commentNumber()));

  scopeIcon = computed(() => {
    const scopeIcon = {
      [scopePost.EVERYONE]: 'pi pi-users',
      [scopePost.FRIENDS]: 'pi pi-user',
      [scopePost.ONLY_ME]: 'pi pi-lock',
    }
    return scopeIcon[this.itemClone().scope] || 'pi pi-users';
  });
  
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

  onClickCloseDialog() {
    this.dynamicDialogRef.close();
  }
  
  getChildrenByParentId(id: string, flatComments: CommentResponseValue[]) {
    const children = flatComments.filter(item => item.idRootComment?.id === id).map((item) => ({
      user: {
        id: item.idUser.id,
        name: item.idUser.name,
        avatar: item.idUser.avatar
      },
      id: item.id,
      content: item.content,
      status: item.status,
      createdAt: item.createdAt,
      children: []
    }));
    if (!children.length) {
      return [];
    }
    return children;
  }

  convertToNestedComments(parentItems: CommentItem[], flatComments: CommentResponseValue[]): CommentItem[] {
    // Map để lưu trữ tất cả các bình luận
    parentItems.forEach((item) => {
      const children = this.getChildrenByParentId(item.id, flatComments);
      if (children.length) {
        this.convertToNestedComments(children, flatComments);
      }
      item.children = children;
    });

    return parentItems;
  }

  getAllCommentByIdPost(idPost: string) {
    this.commentService.getAllCommentByIdPost(idPost).subscribe(response => {
      if (response.statusCode !== 200) {
        return;
      }
      this.commentNumber.update(()=>response.data.length || 0);
      const commentItems = response.data.filter(item => !item.idRootComment).map((item) => ({
        user: {
          id: item.idUser.id,
          name: item.idUser.name,
          avatar: item.idUser.avatar
        },
        id: item.id,
        content: item.content,
        status: item.status,
        createdAt: item.createdAt,
        children: []
      }));
      this.comments.update(()=>this.convertToNestedComments(commentItems, response.data));
    });
  }

  loadCommentList() {
    this.getAllCommentByIdPost(this.idPost());
  }

  onCommentAdded(totalComment: number) {
      this.postSocket.sendCommentPostEvent({...this.itemClone(), countComment: totalComment});
  }

  ngOnInit(): void {
    this.postSocket.listenCommentPostEvent().subscribe((post)=>{
      if(post.id === this.idPost()) {
        this.loadCommentList();
      }
    })
    const idPost = this.dialogConfig.data['id'] || null;
    this.getAllCommentByIdPost(idPost);
    this.currentUser.set(this.userService.currentUserLogin.getValue());

    if (idPost) {
      this.postService.getPostById(idPost).subscribe((response) => {
        if (response.statusCode !== 200) {
          return;
        }
        this.itemClone.set(response.data);
        this.backgroundClass.set(this.itemClone().background.replace('==/==', ' '));
        const feelingAfterSplit = (this.itemClone()?.feelingIcon || '==/==').split('==/==');
        this.titleGroup.set({
          avatar: this.itemClone()?.createdBy?.avatar || '',
          userName: this.itemClone()?.createdBy?.name || '',
          feeling: {
            id: feelingAfterSplit[0],
            value: feelingAfterSplit[1] || '',
            icon: feelingAfterSplit[2] || ''
          },
          friends: (this.itemClone()?.tagFriends || []).map((item) => item.name),
          location: this.itemClone()?.tagLocation || ''
        });
      })
      return;
    }
  }
}
