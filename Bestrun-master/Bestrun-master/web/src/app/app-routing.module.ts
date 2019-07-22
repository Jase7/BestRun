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
import { FriendsComponent } from './components/dashboard/friends/friends.component';
import { AddFriendComponent } from './components/dashboard/friends/add-friend/add-friend.component';
import { FriendRequestsComponent } from './components/dashboard/friends/friend-requests/friend-requests.component';
import { TimeComparatorComponent } from './components/dashboard/friends/time-comparator/time-comparator.component';
import { ProfileComponent } from './components/dashboard/profile/profile.component';
import { SportsmanDataComponent } from './components/dashboard/profile/sportsman-data/sportsman-data.component';
import { FriendsListComponent } from './components/dashboard/friends/friends-list/friends-list.component';
import { ErrorComponent } from './components/error/error.component';
import { TerminosComponent } from './components/dashboard/terminos/terminos.component';
import { ContactoComponent } from './components/dashboard/contacto/contacto.component';
import { FooterComponent } from './components/dashboard/footer/footer.component';
import { QuienesSomosComponent } from './components/dashboard/quienes-somos/quienes-somos.component';


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
        component: FriendsComponent, 
        children: [
          {
            path: '',
            component: FriendsListComponent
          },
          {
            path: 'friends-list',
            component: FriendsListComponent
          },
          {
            path: 'add-friend',
            component: AddFriendComponent
          },
          {
            path: 'friend-requests',
            component: FriendRequestsComponent
          }, 
          {
            path: 'time-comparator/:myID/:friendID',
            component: TimeComparatorComponent
          }
        ]
      }, 
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthenticationService],
        loadChildren: 'src/app/components/dashboard/profile/profile.module#ProfileModule'
      },
      {
         path: 'terminos',
         component: TerminosComponent
      }, 
      {
         path: 'contacto',
         component: ContactoComponent
      },
      {
         path: 'quienes-somos',
         component:QuienesSomosComponent
      },
      {
         path: '**',
         component: ErrorComponent,
         canActivate: [AuthenticationService]

      }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
