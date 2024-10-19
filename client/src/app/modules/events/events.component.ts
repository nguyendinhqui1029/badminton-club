import { Component, inject, OnInit, signal } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { EventRequestBody, EventResponseValue } from '@app/models/event.model';
import { Router } from '@angular/router';
import { path } from '@app/constants/path.constant';
import { LoadingComponent } from '@app/components/loading/loading.component';
import { UserService } from '@app/services/user.service';
import { EventService } from '@app/services/event.service';
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
  private eventService: EventService = inject(EventService);
  public point = signal<number>(0);

  public isEventLoading = signal<boolean>(false);
  public isAccessoryRewardsLoading = signal<boolean>(false);

  responsiveOptions =  [
    { breakpoint: '480px', numVisible: 2, numScroll: 1 },
    { breakpoint: '350px', numVisible: 1, numScroll: 1 }];
  events= signal<EventResponseValue[]>([]);;

  ngOnInit(): void {
    this.userService.getUserById(this.userService.currentUserLogin.getValue().id).subscribe(response=>{
      if(response.statusCode !== 200) {
        return;
      }
      this.point.update(()=>response.data.point);
    });
    this.isEventLoading.update(()=>true);
    this.eventService.getAllEvent(this.userService.currentUserLogin.getValue().id).subscribe(response=>{
      this.isEventLoading.update(()=>false);
      this.events.set(response.data || [])
    });
  }

  onClickViewDetail(event:EventRequestBody) {
    this.route.navigate([`/${path.EVENTS.DETAIL.replace(':id', event.id)}`]);
  }
}
