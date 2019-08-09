import { Component, OnInit } from '@angular/core';
import { ProfileComponent } from '../profile.component';
import { Title } from '@angular/platform-browser';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { months } from "src/app/models/constants";
import { ProfileService } from 'src/app/services/api/profile.service';
import { NotifyService } from 'src/app/services/notify.service';
import { NotificationType } from 'angular2-notifications';
import { Address } from 'src/app/models/address.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
   selector: 'sportsman-data',
   templateUrl: 'sportsman-data.component.html',
   styleUrls: ['sportsman-data.component.css']
})
export class SportsmanDataComponent extends ProfileComponent implements OnInit {

   // private newPaymentMethod: PaymentMethod = { name: "Nueva tarjeta", type: "", cardNumber: "", CVC: "", yearExpire: 0, monthExpire: 0, ownerName: "" }
   // private paymentMethods: PaymentMethod[] = []
   // paymentMethodForm: FormGroup;
   faPlus = faPlus;
   faTrash = faTrash;
   sportsmanForm : FormGroup;
   months = months
   years: number[] = []

   addresses : Address[] = []
   newAddress : Address = new Address();
   editAddress : Address = new Address();

   constructor(private formBuilder: FormBuilder, title: Title, modalService: NgbModal, profileService: ProfileService, private notify: NotifyService) {
      super(title, modalService, profileService)

      this.user = this.profileService.user

      this.sportsmanForm = this.formBuilder.group({
         name: [, Validators.compose([Validators.minLength(3), Validators.maxLength(64), Validators.required])],
         surnames: [, Validators.compose([Validators.minLength(3), Validators.maxLength(64), Validators.required])],
         address: [, Validators.compose([Validators.minLength(3), Validators.maxLength(64), Validators.required])],
         poblation: [, Validators.compose([Validators.minLength(3), Validators.maxLength(64), Validators.required])],
         county: [, Validators.compose([Validators.minLength(3), Validators.maxLength(64), Validators.required])],
         zipcode: [, Validators.compose([Validators.minLength(5), Validators.maxLength(5), Validators.pattern("^[0-9]*$"), Validators.required])],
         shirtsize: [, Validators.compose([Validators.required])],
         sex: [, Validators.compose([Validators.required])],
         phone: [, Validators.compose([Validators.minLength(9), Validators.pattern("^[0-9]*$"), Validators.required])],
         dni: [, Validators.compose([Validators.minLength(3), Validators.maxLength(64), Validators.required])], 
         club: []
      });

      const actualYear = new Date().getFullYear()

      for (let index = actualYear; index <= actualYear + 30; index++) {
         this.years.push(index)
      }
   }

   ngOnInit() {;
      this.getMyData();
   }

  getMyData() {
      this.profileService.getMyData().subscribe((res : any ) => {              
          this.user = this.profileService.user
          this.addresses = this.profileService.user.addresses 
      });
  }

   openModal(content, addressID) {

      this.editAddress = this.addresses.find(e => e._id == addressID)
      this.modal.open(content, { ariaLabelledBy: 'modal-basic-title', size: "lg" });
   }

   saveData() {
      this.profileService.saveData(this.newAddress).subscribe((data: any) => {
         this.notify.show(NotificationType.Info, "Datos", "Tus datos se han modificado correctamente");
      },
         (error) => {
            this.notify.show(NotificationType.Error, "Error", error.error.message)
         });
   }   

   editAddr() {
      this.profileService.editAddress(this.editAddress).subscribe((data: any) => {
         this.notify.show(NotificationType.Info, "Dirección", "Tu dirección se ha modificado correctamente");
      },
         (error) => {
            this.notify.show(NotificationType.Error, "Error", error.error.message)
         });
   }  

   deleteAddr(aid) {
      this.profileService.deleteAddress(aid).subscribe((data: any) => {
         this.notify.show(NotificationType.Info, "Dirección", "La dirección seleccionada se ha borrado correctamente");
      },
         (error) => {
            this.notify.show(NotificationType.Error, "Error", error.error.message)
         });
   }  
}
