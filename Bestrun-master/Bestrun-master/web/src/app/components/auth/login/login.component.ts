import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotifyService} from "../../../services/notify.service";
import {NotificationType} from "angular2-notifications";
import {StorageService} from "../../../services/storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../../services/api/authentication.service";
import {AuthService, FacebookLoginProvider, GoogleLoginProvider} from "angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signInForm: FormGroup;
  page: any = "";

  constructor(public formBuilder: FormBuilder, private notify: NotifyService, private tokenService: StorageService,
              private router: Router, private authService: AuthenticationService, private route: ActivatedRoute,
             private authSocialService: AuthService) {
    this.signInForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(64), Validators.pattern("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])"), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(8), Validators.required])]
    });
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.page = params.page;
      });
  }

  signInWithGoogle(): void {
    this.authSocialService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData) => {
      this.authService.signInGoogle(userData.idToken)
        .subscribe((data: any) => {
            this.router.navigate([this.page]);
          },
          (error) => {
            this.notify.show(NotificationType.Error, "Error login", error.error.message);
          });
    });
  }

  signInWithFB(): void {
    this.authSocialService.signIn(FacebookLoginProvider.PROVIDER_ID).then((userData) => {
      this.authService.signInFacebook(userData.authToken)
        .subscribe((data: any) => {
            this.router.navigate([this.page]);
          },
          (error) => {
            this.notify.show(NotificationType.Error, "Error login", error.error.message);
          });
    });
  }

  onSubmit() {
    this.authService.signIn(this.signInForm.value)
      .subscribe((data: any) => {
          this.router.navigate([this.page]);
        },
        (error) => {
          this.notify.show(NotificationType.Error, "Error login", error.error.message);
        });
  }


}
