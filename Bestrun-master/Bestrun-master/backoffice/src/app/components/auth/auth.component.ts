import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/api/authentication.service";
import {NotifyService} from "../../services/notify.service";
import {NotificationType} from "angular2-notifications";
import {StorageService} from "../../services/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  signInForm: FormGroup;

  constructor(public formBuilder: FormBuilder, public authService: AuthenticationService, private notify: NotifyService, private tokenService: StorageService,
              private router:Router) {
    this.signInForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(64), Validators.pattern("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])"), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(8), Validators.required])]
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    console.warn(this.signInForm.value);
    this.authService.signIn(this.signInForm.value)
      .subscribe((data: any) => {
          this.router.navigate(['']);
        },
        (error) => {
          this.notify.show(NotificationType.Error, "Error login", error.error.message);
        });
  }

}
