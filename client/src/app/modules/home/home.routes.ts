import { Routes } from '@angular/router';
import { HomeComponent } from '@app/modules/home/home.component';
import { DetailComponent } from '@app/modules/home/detail/detail.component';

export const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: ':id',
    component: DetailComponent
  }
];
