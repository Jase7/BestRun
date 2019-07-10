import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotifyService} from "../../../services/notify.service";
import {StorageService} from "../../../services/storage.service";
import {Router} from "@angular/router";
import {NotificationType} from "angular2-notifications";
import {AuthenticationService} from "../../../services/api/authentication.service";
import { Sportsman } from 'src/app/models/sportsman.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  signUpForm: FormGroup;

  constructor(public formBuilder: FormBuilder, private notify: NotifyService, private tokenService: StorageService,
              private router: Router, private authService: AuthenticationService) {
    this.signUpForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      surnames: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(64), Validators.pattern("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])"), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(8), Validators.required])],
      rptpassword: ['', Validators.compose([Validators.minLength(8), Validators.required])]
    });
  }

  ngOnInit() {
  }

  onSubmit() {

   var sportsmanCreate : Sportsman = new Sportsman();
   sportsmanCreate.active = true;
   sportsmanCreate.name = this.signUpForm.value.name;
   sportsmanCreate.surnames = this.signUpForm.value.surnames;
   sportsmanCreate.email = this.signUpForm.value.email;
   sportsmanCreate.password = this.signUpForm.value.password;

    this.authService.register(sportsmanCreate)
      .subscribe((data: any) => {
          this.router.navigate(['']);
        },
        (error) => {
          this.notify.show(NotificationType.Error, "Error login", error.error.message);
        });
  }


}
