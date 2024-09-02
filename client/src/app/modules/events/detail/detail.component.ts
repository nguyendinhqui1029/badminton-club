import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@app/environments/environment';
import { PostService } from '@app/services/post.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {

  private title: Title = inject(Title);
  private meta: Meta = inject(Meta);
  private postService: PostService = inject(PostService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  ngOnInit(): void {
    this.activatedRoute.params.pipe(switchMap((params) => this.postService.getPostById(params['id']))).subscribe((response) => {
      if (response.statusCode === 200) {
        const item = response.data;
        this.title.setTitle(item.content);

        this.meta.addTags([
          {
            content: item.content,
            id: item.id || '',
            name: 'twitter:card',
            property: 'og:title',
          },
          {
            content: item.content,
            id: item.id || '',
            name: 'twitter:card',
            property: 'og:description',
          },
          {
            content: item.images[0] || '',
            id: item.id || '',
            name: 'twitter:card',
            property: 'og:image',
          },
          {
            content: `${environment.domain}/detail/${item.id}`,
            id: item.id || '',
            name: 'twitter:card',
            property: 'og:url',
          },
          {
            content: 'website',
            id: item.id || '',
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
