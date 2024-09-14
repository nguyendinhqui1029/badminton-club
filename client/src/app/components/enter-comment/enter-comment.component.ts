import { Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMOJI } from '@app/constants/emoji.content';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UploadFileComponent } from '@app/components/upload-file/upload-file.component';
import { CommentService } from '@app/services/comment.service';
import { CommentRequestBody } from '@app/models/comment.model';

@Component({
  selector: 'app-enter-comment',
  standalone: true,
  imports: [ReactiveFormsModule ,FormsModule, UploadFileComponent, InputTextareaModule],
  templateUrl: './enter-comment.component.html',
  styleUrl: './enter-comment.component.scss'
})
export class EnterCommentComponent implements OnInit{
  
  @Output() eventSubmitSuccess = new EventEmitter();
  idPost = input.required<string>();
  idUser = input.required<string>();
  idComment = input<string | null>(null);
  placeholder = input<string>('Nhập bình luận');

  emojis = EMOJI;
  isEmojiActive: boolean = false;
  isSelectImageActive: boolean = false;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private commentService: CommentService = inject(CommentService);
  formGroup!:FormGroup;

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      comment: ['', Validators.required],
      images: [[]],
      idRootComment: ['']
    })
  }
  onEmojiClick(value: string) {
    this.formGroup.get('comment')?.setValue(this.formGroup.get('comment')?.value + value) ;
  }
  onClickToggleEmoji() {
    this.isEmojiActive = !this.isEmojiActive;
    this.isSelectImageActive = false;
  }
  onClickToggleSelectImage() {
    this.isSelectImageActive = !this.isSelectImageActive;
    this.isEmojiActive = false;
  }

  handleSubmit() {
      if(!this.formGroup.valid) {
        return;
      }
      const body: CommentRequestBody = {
        content: this.formGroup.value.comment.toString() || '',
        status: 'APPROVED',
        idRootComment: this.idComment() || null,
        idUser: this.idUser(),
        images: this.formGroup.value.images,
        idPost: this.idPost(),
      };
      this.commentService.createComment(body).subscribe((commentRepose)=>{
        if(commentRepose.statusCode !== 200) {
          return;
        }
        this.formGroup.reset();
        this.eventSubmitSuccess.emit();
      });
  }
}
