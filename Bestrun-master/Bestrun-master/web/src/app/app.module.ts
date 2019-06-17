import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/auth/login/login.component';
import {RegisterComponent} from './components/auth/register/register.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {NotifyService} from "./services/notify.service";
import {StorageService} from "./services/storage.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SimpleNotificationsModule} from "angular2-notifications";
import {AuthFacebookService} from "./services/api/auth-facebook.service";
import {NgbDatepickerModule, NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {AuthenticationService} from "./services/api/authentication.service";
import {EventComponent} from './components/dashboard/event/event.component';
import {EventsService} from "./services/api/events.service";
import {TypeEventsService} from "./services/api/type-events.service";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {ImageEventPipe} from './pipe/image-event.pipe';
import {ShowEventComponent} from './components/dashboard/event/show-event/show-event.component';
import {SearchNavbarService} from "./services/search-navbar.service";
import {MyEventsComponent} from './components/dashboard/my-events/my-events.component';
import {TokenInterceptor} from "./services/token-interceptor.service";
import {MyTimesComponent} from './components/dashboard/my-times/my-times.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ShareButtonModule} from "@ngx-share/button";
import {FriendsComponent} from './components/dashboard/friends/friends.component';

import {SocialLoginModule, AuthServiceConfig, FacebookLoginProvider} from "angularx-social-login";
import { GoogleLoginProvider} from "angularx-social-login";
import { AddFriendComponent } from './components/dashboard/friends/add-friend/add-friend.component';
import { FriendRequestsComponent } from './components/dashboard/friends/friend-requests/friend-requests.component';
import { TimeComparatorComponent } from './components/dashboard/friends/time-comparator/time-comparator.component';
import { ProfileComponent } from './components/dashboard/profile/profile.component';
import { ProfileService } from './services/api/profile.service';
import { SportsmanDataComponent } from './components/dashboard/profile/sportsman-data/sportsman-data.component';
import { FriendsListComponent } from './components/dashboard/friends/friends-list/friends-list.component';
import { FooterComponent } from './components/dashboard/footer/footer.component';


let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("592124169403-th6kuk6rk3rue80p8htkh5j7le36j4i6.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("2710923765615144")
  },
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    EventComponent,
    ImageEventPipe,
    ShowEventComponent,
    MyEventsComponent,
    MyTimesComponent,
    FriendsComponent,
    AddFriendComponent,
    FriendRequestsComponent,
    TimeComparatorComponent, 
    ProfileComponent, FriendsListComponent, FooterComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
    SimpleNotificationsModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    NgbDatepickerModule,
    ShareButtonModule,
    FontAwesomeModule,
    SocialLoginModule.initialize(config), 
    NgbModalModule,
  ],
  providers: [
    NotifyService,
    StorageService,
    AuthFacebookService,
    AuthenticationService,
    EventsService,
    TypeEventsService,
    SearchNavbarService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    ProfileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
