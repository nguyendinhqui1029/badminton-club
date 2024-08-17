import { Component } from '@angular/core';
import { CreatePostComponent } from '@app/components/create-post/create-post.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CreatePostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
