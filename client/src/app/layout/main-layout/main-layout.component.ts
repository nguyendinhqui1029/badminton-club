import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventsComponent } from '@app/components/events/events.component';
import { NavigationComponent } from '@app/components/navigation/navigation.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, EventsComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}
