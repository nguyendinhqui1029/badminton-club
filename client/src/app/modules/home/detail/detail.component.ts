import { Component, inject, OnInit, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '@app/environments/environment';
import { PostResponseValue } from '@app/models/post.model';
import { PostService } from '@app/services/post.service';
import { ButtonModule } from 'primeng/button';
import { switchMap } from 'rxjs';
import { ImageModule } from 'primeng/image';
import { path } from '@app/constants/path.constant';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [RouterLink, ButtonModule, ImageModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {

  private title: Title = inject(Title);
  private meta: Meta = inject(Meta);
  private postService: PostService = inject(PostService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  
  itemDetail =  signal<PostResponseValue | null>(null);
  homePath = `/${path.HOME.ROOT}`;
  ngOnInit(): void {
    this.activatedRoute.params.pipe(switchMap((params) => this.postService.getPostById(params['id']))).subscribe((response) => {
      if (response.statusCode === 200) {
        this.itemDetail.set(response.data);
        this.title.setTitle('Chi tiết bài viết');

        this.meta.addTags([
          {
            content: this.itemDetail()?.images[0] || '',
            id: this.itemDetail()?.id || '',
            name: 'twitter:card',
            property: 'og:image',
          },
          {
            content: `${environment.domain}/detail/${this.itemDetail()?.id}`,
            id: this.itemDetail()?.id || '',
            name: 'twitter:card',
            property: 'og:url',
          },
          {
            content: 'website',
            id: this.itemDetail()?.id || '',
            name: 'twitter:card',
            property: 'og:type',
          }
        ])
      }
    })
  }

  //   <meta itemprop="name" content="Test website">
  // <meta itemprop="description" content="This is the website description. Nice eh?">
  // <meta itemprop="image" content="https://lorempixel.com/400/200/">
  // <!-- Facebook Meta Tags -->
  // <meta property="og:url" content="https://nothing.com">
  // <meta property="og:type" content="website">
  // <meta property="og:title" content="Test website">
  // <meta property="og:description" content="This is the website description. Nice eh?">
  // <meta property="og:image" content="https://lorempixel.com/400/200/">
  // <!-- Twitter Meta Tags -->
  // <meta name="twitter:card" content="summary_large_image">
  // <meta name="twitter:title" content="Test website">
  // <meta name="twitter:description" content="This is the website description. Nice eh?">
  // <meta name="twitter:image" content="https://lorempixel.com/400/200/">
}
