import { Routes } from '@angular/router';
import { EventsComponent } from '@app/modules/events/events.component';
import { DetailComponent } from '@app/modules/events/detail/detail.component';

export const eventsRoutes: Routes = [
    {
        path: '',
        component: EventsComponent
    },
    {
        path: ':id',
        component: DetailComponent
      }
];
