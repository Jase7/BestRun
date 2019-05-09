import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {AuthComponent} from "./components/auth/auth.component";
import {AuthenticationService} from "./services/api/authentication.service";
import {AdminsComponent} from "./components/dashboard/admins/admins.component";
import {EditAdminComponent} from "./components/dashboard/admins/edit-admin/edit-admin.component";
import {ShowAdminComponent} from "./components/dashboard/admins/show-admin/show-admin.component";
import {NewAdminComponent} from "./components/dashboard/admins/new-admin/new-admin.component";
import {SportsmanComponent} from "./components/dashboard/sportsman/sportsman.component";
import {ShowSportsmanComponent} from "./components/dashboard/sportsman/show-sportsman/show-sportsman.component";
import {EditSportsmanComponent} from "./components/dashboard/sportsman/edit-sportsman/edit-sportsman.component";
import {NewSportsmanComponent} from "./components/dashboard/sportsman/new-sportsman/new-sportsman.component";
import {EventsComponent} from "./components/dashboard/events/events.component";
import {NewEventComponent} from "./components/dashboard/events/new-event/new-event.component";
import {ShowEventComponent} from "./components/dashboard/events/show-event/show-event.component";
import {EditEventComponent} from "./components/dashboard/events/edit-sportsman/edit-event.component";
import {AuthorizationService} from "./services/api/authorization.service";
import {LogsComponent} from "./components/dashboard/logs/logs.component";

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthenticationService],
    children: [
      {
        path: '',
        redirectTo: 'sportsman',
        pathMatch: 'full'
      },
      {
        path: 'sportsman',
        children: [
          {
            path: '',
            component: SportsmanComponent
          },
          {
            path: 'new',
            component: NewSportsmanComponent
          },
          {
            path: 'edit/:id',
            component: EditSportsmanComponent
          },
          {
            path: 'show/:id',
            component: ShowSportsmanComponent
          }
        ]
      },
      {
        path: 'events',
        children: [
          {
            path: '',
            component: EventsComponent
          },
          {
            path: 'new',
            component: NewEventComponent
          },
          {
            path: 'edit/:id',
            component: EditEventComponent
          },
          {
            path: 'show/:id',
            component: ShowEventComponent
          }
        ]
      },
      {
        path: 'admins',
        canActivate: [AuthorizationService],
        children: [
          {
            path: '',
            component: AdminsComponent,
          },
          {
            path: 'new',
            component: NewAdminComponent
          },
          {
            path: 'edit/:id',
            component: EditAdminComponent
          },
          {
            path: 'show/:id',
            component: ShowAdminComponent
          }
        ]
      },
      {
        path: 'logs',
        canActivate: [AuthorizationService],
        component: LogsComponent
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
