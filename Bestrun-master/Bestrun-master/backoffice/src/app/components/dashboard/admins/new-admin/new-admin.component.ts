import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdminsService} from "../../../../services/api/admins.service";
import {NotifyService} from "../../../../services/notify.service";
import {Router} from "@angular/router";
import {NotificationType} from "angular2-notifications";

@Component({
  selector: 'app-new-admin',
  templateUrl: './new-admin.component.html',
  styleUrls: ['./new-admin.component.css']
})
export class NewAdminComponent implements OnInit {

  editAdminForm: FormGroup;

  constructor(public formBuilder: FormBuilder, private adminsService: AdminsService, private notify: NotifyService,
              private router: Router) {
  }

  ngOnInit() {
    this.editAdminForm = this.formBuilder.group({
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
    let admin = this.editAdminForm.value;
    delete admin.confirmPass;
    if(!admin.mobileNumber)delete admin.mobileNumber;
    console.warn(admin);
    this.adminsService.createAdmin(admin).subscribe((data: any) => {
        // this.router.navigate(['']);
        console.log(data);
        this.notify.show(NotificationType.Success, "Admin created", "Administrador creado con éxito");
        this.router.navigate(['/admins/show', data.id]);
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error login", error.error.message);
      });
  }
}
