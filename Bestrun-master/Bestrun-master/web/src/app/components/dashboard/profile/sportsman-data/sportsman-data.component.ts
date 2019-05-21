import { Component, OnInit } from '@angular/core';
import { ProfileComponent } from '../profile.component';
import { Title } from '@angular/platform-browser';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PaymentMethod } from 'src/app/models/paymentMethod.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {months} from "src/app/models/constants";
import { ProfileService } from 'src/app/services/api/profile.service';
import { NotifyService } from 'src/app/services/notify.service';
import { NotificationType } from 'angular2-notifications';

@Component({
    selector: 'sportsman-data',
    templateUrl: 'sportsman-data.component.html',
    styleUrls: ['sportsman-data.component.css']
})
export class SportsmanDataComponent extends ProfileComponent implements OnInit {

    private newPaymentMethod : PaymentMethod = {name: "Nueva tarjeta", type: "", cardNumber: "", CVC: "", yearExpire: 0, monthExpire: 0}
    private paymentMethods : PaymentMethod[] = []
    faPlus = faPlus;
    faTrash = faTrash;
    paymentMethodForm : FormGroup;
    months = months
    years : number[] = []

    constructor(public formBuilder: FormBuilder, title : Title, modalService: NgbModal, profileService : ProfileService, private notify : NotifyService) {
        super(title, modalService, profileService)

        this.user = this.profileService.user
        
        this.paymentMethodForm = this.formBuilder.group({            
            name: [, Validators.compose([Validators.minLength(3), Validators.maxLength(64), Validators.required])],
            creditnumber: ['', Validators.compose([Validators.minLength(16), Validators.maxLength(16), Validators.required])],
            monthExpire: ['', Validators.compose([])], 
            yearExpire: ['', Validators.compose([])],
            CVC: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(3)])]
        });

        const actualYear = new Date().getFullYear()

        for (let index = actualYear; index <= actualYear + 30; index++) {
            this.years.push(index)     
        }
    }

    ngOnInit() {
        this.getPaymentMethods();
    }

    openModal(content) {
        this.modal.open(content, {ariaLabelledBy: 'modal-basic-title', size: "lg"});
    }

    getPaymentMethods() {

        this.profileService.getPaymentMethods().subscribe((res : any) => {
            this.paymentMethods = res
        });
    }

    addPaymentMethod() {
        this.profileService.setNewPaymentMethod(this.newPaymentMethod).subscribe((data : any) => {
            this.modal.dismissAll();
            this.notify.show(NotificationType.Info, "Método de pago", "El método de pago se ha creado correctamente")           
        },
        (error) => {
            this.notify.show(NotificationType.Error, "Error", error.error.message)
        });        
    }

    deletePaymentMethod(PID : any) {
        
        this.profileService.deletePaymentMethod(PID.dataset.pid).subscribe((data : any) => {
            this.notify.show(NotificationType.Info, "Método de pago", "El método de pago se ha eliminado correctamente")
            PID.remove();
        },
        (error) => {
            this.notify.show(NotificationType.Error, "Error", error.error.message)
        });
    }

    saveData() {
        this.profileService.saveAddressAndShirtSize(this.profileService.user.address, this.profileService.user.shirtsize).subscribe((data : any) => {
            this.notify.show(NotificationType.Info, "Datos", "Tus datos se han modificado correctamente");            
        },
        (error) => {
            this.notify.show(NotificationType.Error, "Error", error.error.message)
        });
    }
}
