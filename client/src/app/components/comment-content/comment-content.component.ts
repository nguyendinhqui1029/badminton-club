import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { defaultAvatar } from '@app/constants/common.constant';
import { CommentItem } from '@app/models/comment.model';
import { getTimeDifference } from '@app/utils/date.util';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-comment-content',
  standalone: true,
  imports: [AvatarModule],
  templateUrl:'./comment-content.component.html',
  styleUrl:'./comment-content.component.scss'
})
export class CommentContentComponent {
  comment = input.required<CommentItem>();
  createdTime = computed(()=>getTimeDifference(new Date(this.comment().createdAt)));
  @Output() eventReply = new EventEmitter<CommentItem>();
  @Output() eventSeeMore = new EventEmitter<CommentItem>();

  defaultAvatar = defaultAvatar;
  onClickReply() {
    this.eventReply.emit(this.comment());
  }

  onClickSeeMore() {
    this.eventSeeMore.emit(this.comment());
  }
}
