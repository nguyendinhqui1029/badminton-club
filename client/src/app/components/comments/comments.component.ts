import { Component, input } from '@angular/core';
import { CommentItem } from '@app/models/comment.model';
import { CommentContentComponent } from '@app/components/comment-content/comment-content.component';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommentContentComponent],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent {
  comments = input.required<CommentItem[]>();

  handleEventReply(value: CommentItem) {
    console.log(value);
  }
}
