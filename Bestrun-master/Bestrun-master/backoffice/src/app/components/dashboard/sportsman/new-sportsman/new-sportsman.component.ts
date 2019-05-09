import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdminsService} from "../../../../services/api/admins.service";
import {NotifyService} from "../../../../services/notify.service";
import {Router} from "@angular/router";
import {NotificationType} from "angular2-notifications";
import {SportsmanService} from "../../../../services/api/sportsman.service";

@Component({
  selector: 'app-new-sportsman',
  templateUrl: './new-sportsman.component.html',
  styleUrls: ['./new-sportsman.component.css']
})
export class NewSportsmanComponent implements OnInit {

  editSportsmanForm: FormGroup;

  constructor(public formBuilder: FormBuilder, private sportsmanService: SportsmanService, private notify: NotifyService,
              private router: Router) {
  }

  ngOnInit() {
    this.editSportsmanForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      surnames: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(64), Validators.pattern("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])"), Validators.required])],
      mobileNumber: [undefined],
      active: [true],
      password: ['', Validators.compose([Validators.minLength(8), Validators.required])],
      confirmPass: ['', Validators.compose([Validators.required])]
    }, {validators: this.checkPasswords});
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPass.value;

    return pass === confirmPass ? null : {notSame: true}
  }

  onSubmit() {
    let sportsman = this.editSportsmanForm.value;
    delete sportsman.confirmPass;
    if(!sportsman.mobileNumber)delete sportsman.mobileNumber;
    console.warn(sportsman);
    this.sportsmanService.createSportsman(sportsman).subscribe((data: any) => {
        // this.router.navigate(['']);
        console.log(data);
        this.notify.show(NotificationType.Success, "User created", "Usuario creado con éxito");
        this.router.navigate(['/sportsman/show', data.id]);
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error create user", error.error.message);
      });
  }
}
