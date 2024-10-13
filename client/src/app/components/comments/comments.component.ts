import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { CommentItem } from '@app/models/comment.model';
import { CommentContentComponent } from '@app/components/comment-content/comment-content.component';
import { PostResponseValue } from '@app/models/post.model';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommentContentComponent],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent {
  post = input.required<PostResponseValue>();
  comments = input.required<CommentItem[]>();
}
