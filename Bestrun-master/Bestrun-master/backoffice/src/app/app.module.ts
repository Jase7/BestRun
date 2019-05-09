import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from './/app-routing.module';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {AuthComponent} from './components/auth/auth.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthenticationService} from "./services/api/authentication.service";
import {NotifyService} from "./services/notify.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule} from "@angular/common";
import {SimpleNotificationsModule} from "angular2-notifications";
import {AdminsService} from "./services/api/admins.service";
import {StorageService} from "./services/storage.service";
import {AdminsComponent} from './components/dashboard/admins/admins.component';
import {EditAdminComponent} from './components/dashboard/admins/edit-admin/edit-admin.component';
import {ShowAdminComponent} from './components/dashboard/admins/show-admin/show-admin.component';
import {NewAdminComponent} from './components/dashboard/admins/new-admin/new-admin.component';
import {SportsmanService} from "./services/api/sportsman.service";
import {SportsmanComponent} from "./components/dashboard/sportsman/sportsman.component";
import {ShowSportsmanComponent} from "./components/dashboard/sportsman/show-sportsman/show-sportsman.component";
import {NewSportsmanComponent} from "./components/dashboard/sportsman/new-sportsman/new-sportsman.component";
import {EditSportsmanComponent} from "./components/dashboard/sportsman/edit-sportsman/edit-sportsman.component";
import {EventsService} from "./services/api/events.service";
import {EventsComponent} from "./components/dashboard/events/events.component";
import {NewEventComponent} from "./components/dashboard/events/new-event/new-event.component";
import {
  NgbDatepickerModule,
  NgbModalModule,
  NgbPaginationModule, NgbTabsetModule,
  NgbTimepickerModule, NgbTooltipModule, NgbTypeaheadModule
} from "@ng-bootstrap/ng-bootstrap";
import {ShowEventComponent} from "./components/dashboard/events/show-event/show-event.component";
import {EditEventComponent} from "./components/dashboard/events/edit-sportsman/edit-event.component";
import {AuthorizationService} from "./services/api/authorization.service";
import {UsersService} from "./services/api/users.service";
import {TypeEventsService} from "./services/api/type-events.service";
import {LogsService} from "./services/api/logs.service";
import {LogsComponent} from "./components/dashboard/logs/logs.component";
import {TokenInterceptor} from "./services/token-interceptor.service";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AuthComponent,
    AdminsComponent,
    EditAdminComponent,
    ShowAdminComponent,
    NewAdminComponent,
    SportsmanComponent,
    ShowSportsmanComponent,
    NewSportsmanComponent,
    EditSportsmanComponent,
    EventsComponent,
    NewEventComponent,
    ShowEventComponent,
    EditEventComponent,
    LogsComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbTabsetModule,
    NgbTooltipModule,
    NgbTypeaheadModule
  ],
  providers: [
    AuthenticationService,
    AuthorizationService,
    NotifyService,
    AdminsService,
    SportsmanService,
    EventsService,
    StorageService,
    UsersService,
    TypeEventsService,
    LogsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
