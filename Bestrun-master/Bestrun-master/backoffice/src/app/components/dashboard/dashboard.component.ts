import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/api/authentication.service";
import { AuthorizationService } from "../../services/api/authorization.service";
import { NotificationType } from "angular2-notifications";
import { NotifyService } from "../../services/notify.service";
import { Admin } from "../../models/admin.model";
import { Router } from "@angular/router";

@Component({
   selector: 'app-dashboard',
   templateUrl: './dashboard.component.html',
   styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

   collapse = false;
   role = 'Admin';
   public static _profile: Admin;

   constructor(private authService: AuthenticationService, private authorization: AuthorizationService, private notify: NotifyService,
      private router: Router) { }

   ngOnInit() {

      this.authorization.getProfile().subscribe(
         (profile) => {

            DashboardComponent._profile = profile;
            this.role = profile.role;
         },
         (error) => {

            this.notify.show(NotificationType.Error, "Error get profile", error.error.message);
         }
      );
   }

   clickToggle() {
      this.collapse = !this.collapse;
   }

   signOut() {
      this.authService.signOut();
   }
}
