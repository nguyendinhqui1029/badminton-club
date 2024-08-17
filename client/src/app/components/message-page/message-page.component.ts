import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-message-page',
  standalone: true,
  imports: [ButtonModule, RouterModule],
  templateUrl: './message-page.component.html',
  styleUrl: './message-page.component.scss'
})
export class MessagePageComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  backgroundImage: string = 'url(assets/images/404.webp)';
  title: string = 'Ôi không! Bạn đã bị lạc đường.';
  description: string = 'Trang bạn đang tìm kiếm không tồn tại. Cách bạn đến đây là một điều bí ẩn. Nhưng bạn có thể nhấn vào nút bên dưới để quay lại trang chủ.';
  
  ngOnInit(): void {
    this.backgroundImage = this.activatedRoute.snapshot.data['backgroundImage'] || this.backgroundImage;
    this.title = this.activatedRoute.snapshot.data['title'] || this.title;
    this.description = this.activatedRoute.snapshot.data['description'] || this.description;
  }
}
