import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from "./components/auth/login/login.component";
import {RegisterComponent} from "./components/auth/register/register.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {EventComponent} from "./components/dashboard/event/event.component";
import {ShowEventComponent} from "./components/dashboard/event/show-event/show-event.component";
import {AuthenticationService} from "./services/api/authentication.service";
import {MyEventsComponent} from "./components/dashboard/my-events/my-events.component";
import {MyTimesComponent} from "./components/dashboard/my-times/my-times.component";
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { FriendsComponent } from './components/dashboard/friends/friends.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: EventComponent
      },
      {
        path: 'event/:id',
        component: ShowEventComponent
      },
      {
        path: 'my-events',
        canActivate: [AuthenticationService],
        component: MyEventsComponent
      },
      {
        path: 'my-times',
        canActivate: [AuthenticationService],
        component: MyTimesComponent
      },
      {
        path: "friends",
        canActivate: [AuthenticationService],
        component: FriendsComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
