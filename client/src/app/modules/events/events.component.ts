import { Component, inject, OnInit, signal } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { EventRequestBody } from '@app/models/event.model';
import { Router } from '@angular/router';
import { path } from '@app/constants/path.constant';
import { LoadingComponent } from '@app/components/loading/loading.component';
import { UserService } from '@app/services/user.service';
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CarouselModule, ButtonModule, TagModule, LoadingComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  private route: Router = inject(Router);
  private userService: UserService = inject(UserService);
  public point = signal<number>(0);

  public isEventLoading = signal<boolean>(false);
  public isAccessoryRewardsLoading = signal<boolean>(false);
  public isFilmTicketRewardLoading = signal<boolean>(false);

  responsiveOptions =  [
    { breakpoint: '480px', numVisible: 2, numScroll: 1 },
    { breakpoint: '350px', numVisible: 1, numScroll: 1 }];
  events: EventRequestBody[] = [
    {
      id: '12',
      name: 'Event 12',
      expectedBudget: 1000,
      description: 'When autoplayInterval is defined in milliseconds, items are scrolled automatically. In addition, for infinite scrolling circular property needs to be added which is enabled automatically in auto play mode.',
      thumbnail: 'https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-f6eeb04/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg',
      status: 'ON'
    },
    {
      id: '13',
      name: 'Event 13',
      expectedBudget: 1000,
      description: 'When autoplayInterval is defined in milliseconds, items are scrolled automatically. In addition, for infinite scrolling circular property needs to be added which is enabled automatically in auto play mode.',
      thumbnail: 'https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-f6eeb04/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg',
      status: 'ON'
    },
    {
      id: '14',
      name: 'Event 14',
      expectedBudget: 1000,
      description: 'When autoplayInterval is defined in milliseconds, items are scrolled automatically. In addition, for infinite scrolling circular property needs to be added which is enabled automatically in auto play mode.',
      thumbnail: 'https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-f6eeb04/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg',
      status: 'ON'
    },
    {
      id: '15',
      name: 'Event 15',
      expectedBudget: 1000,
      description: 'When autoplayInterval is defined in milliseconds, items are scrolled automatically. In addition, for infinite scrolling circular property needs to be added which is enabled automatically in auto play mode.',
      thumbnail: 'https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-f6eeb04/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg',
      status: 'ON'
    }
  ];

  ngOnInit(): void {
    this.userService.getUserById(this.userService.currentUserLogin.getValue().id).subscribe(response=>{
      if(response.statusCode !== 200) {
        return;
      }
      this.point.update(()=>response.data.point);
    })
  }

  onClickViewDetail(event:EventRequestBody) {
    this.route.navigate([`/${path.EVENTS.DETAIL.replace(':id', event.id)}`]);
  }
}
