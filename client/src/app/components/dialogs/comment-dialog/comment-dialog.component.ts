import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentsComponent } from '@app/components/comments/comments.component';
import { ImagesGridComponent } from '@app/components/images-grid/images-grid.component';
import { defaultAvatar, INIT_POST_VALUE, scopePost } from '@app/constants/common.constant';
import { CommentItem } from '@app/models/comment.model';
import { PostResponseValue } from '@app/models/post.model';
import { PostService } from '@app/services/post.service';
import { getTimeDifference } from '@app/utils/date.util';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
interface UserStatus { avatar: string; userName: string; feeling?: {id: string; icon: string; value: string}; friends: string[];location: string;};


@Component({
  selector: 'app-comment-dialog',
  standalone: true,
  imports: [ReactiveFormsModule,
    FormsModule,
    ButtonModule, 
    AvatarModule,
    ImagesGridComponent,
    CommentsComponent
   ],
  templateUrl: './comment-dialog.component.html',
  styleUrl: './comment-dialog.component.scss'
})
export class CommentDialogComponent implements OnInit {
  private postService: PostService = inject(PostService);
  private dialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  defaultAvatar = defaultAvatar;

  comments = signal<CommentItem[]>([{
    user: {
      id: '1',
      name: 'Ng',
      avatar: ''
    },
    id: '12',
    content: 'Test',
    createdAt: '2024-08-10',
    children: [{
      user: {
        id: '1',
        name: 'Ng',
        avatar: ''
      },
      id: '12',
      content: 'Test',
      createdAt: '2024-08-10',
      children: [{
        user: {
          id: '1',
          name: 'Ng',
          avatar: ''
        },
        id: '12',
        content: 'Test',
        createdAt: '2024-08-10',
        children: [{
          user: {
            id: '1',
            name: 'Ng',
            avatar: ''
          },
          id: '12',
          content: 'Test',
          createdAt: '2024-08-10',
          children: []
        }]
      }]
    }]
  }]) ;
  backgroundClass = signal<string>('');
  itemClone = signal<PostResponseValue>(INIT_POST_VALUE);

  createdTime = computed(()=>getTimeDifference(new Date(this.itemClone().createdAt)));
  userStatusDisplay = computed(()=> {
    return this.generateUserStatus();
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
  scopeIcon = computed(()=> {
    const scopeIcon = {
      [scopePost.EVERYONE]: 'pi pi-users',
      [scopePost.FRIENDS]: 'pi pi-user',
      [scopePost.ONLY_ME]: 'pi pi-lock',
    }
    return scopeIcon[this.itemClone().scope] || 'pi pi-users';
  });
  generateUserStatus() {
    let status = '';
    if(this.titleGroup()?.userName) {
      status += `<h4 class="font-bold text-lg leading-6">${this.titleGroup()?.userName}</h4>`;
    }

    if(this.titleGroup()?.feeling?.icon && this.titleGroup()?.feeling?.value) {
       status += `&nbsp;đang cảm thấy&nbsp; <strong> ${this.titleGroup()?.feeling?.value} </strong> &nbsp;${this.titleGroup()?.feeling?.icon}`;
       if(!this.titleGroup()?.location && !this.titleGroup()?.friends?.length) {
        return `${status}.`;
      }
    }

    if(this.titleGroup()?.friends?.length) {
      status += `&nbsp;cùng với&nbsp;<strong> 
            ${
              this.titleGroup()?.friends?.length < 2 
              ? this.titleGroup()?.friends[0]
              : this.titleGroup()?.friends?.length == 2 
              ? `${this.titleGroup()?.friends[0]}, ${this.titleGroup()?.friends[1]}`
              : `${this.titleGroup()?.friends[0]}, ${this.titleGroup()?.friends[1]}</strong>&nbsp;và&nbsp;<strong>${this.titleGroup()?.friends.length - 2}</strong>&nbsp;người khác`
            }`;
      if(!this.titleGroup()?.location) {
        return `${status}.`;
      }
    }
    if(this.titleGroup()?.location) {
      status += `&nbsp;tại&nbsp;<strong> ${this.titleGroup()?.location}.</strong>`;
      return status;
    }
    return status;
  }
  onClickCloseDialog() {
    this.dynamicDialogRef.close();
  }
  ngOnInit(): void {
    const idPost = this.dialogConfig.data['id'] || null;
    if(idPost) {
      this.postService.getPostById(idPost).subscribe((response)=>{
        if(response.statusCode !== 200){
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
          friends: (this.itemClone()?.tagFriends || []).map((item)=>item.name),
          location: this.itemClone()?.tagLocation || ''
        });
      })
      return;
    }
  }
}
