import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WeatherComponent } from '../weather/weather.component';

const appRoutes: Routes = [
  { 
    path:'', 
    component: WeatherComponent
  }
];
@NgModule({
  declarations: [],
  imports: [
   RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
