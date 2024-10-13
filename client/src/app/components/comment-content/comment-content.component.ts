import { Component, computed, ElementRef, EventEmitter, HostListener, inject, input, Output, signal, ViewChild } from '@angular/core';
import { defaultAvatar } from '@app/constants/common.constant';
import { CommentItem } from '@app/models/comment.model';
import { getTimeDifference } from '@app/utils/date.util';
import { AvatarModule } from 'primeng/avatar';
import { EnterCommentComponent } from '@app/components/enter-comment/enter-comment.component';
import { PostSocket } from '@app/sockets/post.socket';
import { PostResponseValue } from '@app/models/post.model';
import { CommentService } from '@app/services/comment.service';

@Component({
  selector: 'app-comment-content',
  standalone: true,
  imports: [AvatarModule, EnterCommentComponent],
  templateUrl:'./comment-content.component.html',
  styleUrl:'./comment-content.component.scss'
})
export class CommentContentComponent {
  post = input.required<PostResponseValue>();
  comment = input.required<CommentItem>();

  @ViewChild('enterComment', { static: false }) enterComment!: ElementRef;
  
  private postSocket: PostSocket = inject(PostSocket);

  createdTime = computed(()=>getTimeDifference(new Date(this.comment().createdAt)));
  isShowEnterText = signal<boolean>(false);
  defaultAvatar = defaultAvatar;

  onClickReply() {
    this.isShowEnterText.update(value=>!value);
  }

  onCommentAdded(totalComment: number) {
    this.postSocket.sendCommentPostEvent({...this.post(), countComment: totalComment});
    this.isShowEnterText.update(()=>false);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = this.enterComment?.nativeElement.contains(target);
    this.enterComment.nativeElement.scrollIntoView({ behavior: 'smooth' })
    if (!clickedInside) {
      this.isShowEnterText.update(()=>false);
    }
  }
}
