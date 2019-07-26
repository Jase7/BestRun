import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminsService } from "../../../../services/api/admins.service";
import { NotificationType } from "angular2-notifications";
import { NotifyService } from "../../../../services/notify.service";
import { Admin } from "../../../../models/admin.model";
import { ActivatedRoute, Router } from "@angular/router";
import { DashboardComponent } from '../../dashboard.component';

@Component({
   selector: 'app-edit-admin',
   templateUrl: './edit-admin.component.html',
   styleUrls: ['./edit-admin.component.css']
})
export class EditAdminComponent implements OnInit {

   editAdminForm: FormGroup;
   id: number;
   admin: Admin = new Admin();
   changePassword: boolean = false;
   myprofile : Admin = DashboardComponent._profile;

   constructor(public formBuilder: FormBuilder, private adminsService: AdminsService, private notify: NotifyService,
      private route: ActivatedRoute, private router: Router) {


      this.editAdminForm = this.formBuilder.group({

         name: ['', Validators.compose([Validators.required])],
         surnames: ['', Validators.compose([Validators.required])],
         email: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(64), Validators.pattern("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])"), Validators.required])],
         mobileNumber: [''],
         active: [true],
         password: ['', Validators.compose([Validators.minLength(8)])],
         rol: ['', Validators.required]
      });
   }

   ngOnInit() {

      this.route.params.subscribe(params => {
         this.id = params['id'];
      });

      if (this.id) {

         this.adminsService.getAdmin(this.id).subscribe(

            (admin) => {

               this.admin = admin;
               this.setupForm();
            },
            (error) => {
               this.notify.show(NotificationType.Error, "Error login", error.error.message);
            });
      }
   }

   setupForm() {

      this.editAdminForm.setValue({
         name: this.admin.name,
         surnames: this.admin.surnames,
         email: this.admin.email,
         mobileNumber: this.admin.mobileNumber ? this.admin.mobileNumber : '',
         active: this.admin.active,
         password: this.admin.password ? this.admin.password : '',
         rol: this.admin.role ? this.admin.role : ''
      });
   }

   onSubmit() {

      let admin = this.editAdminForm.value;
      admin.id = this.admin.id;

      if (admin.mobileNumber === "") delete admin.mobileNumber;
      if (admin.password === "") delete admin.password;

      this.adminsService.editAdmin(admin).subscribe((data: any) => {

         this.notify.show(NotificationType.Success, "Admin created", "Administrador actualizado con éxito");
         this.router.navigate(['/admins/show', data.id]);
      },
         (error) => {
            this.notify.show(NotificationType.Error, "Error Create", error.error.message);
         });
   }
}
