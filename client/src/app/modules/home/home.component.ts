import { PostResponseValue } from '@app/models/post.model';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '@app/components/card/card.component';
import { CreatePostComponent } from '@app/components/create-post/create-post.component';
import { PostService } from '@app/services/post.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CreatePostComponent, CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
 
  private postService: PostService = inject(PostService);
  posts = signal<PostResponseValue[]>([]);

  getDataList() {
    this.postService.getAllPost().subscribe((response)=>{
      if(response.statusCode !== 200) {
        return;
      }
      this.posts.update(()=>[...response.data]);
    });
  }
  ngOnInit(): void {
    this.getDataList();
  }

  handleReFreshDataList() {
    this.getDataList();
  }
}
