import { Component, OnInit } from '@angular/core';
import { ProfileComponent } from '../profile.component';
import { Title } from '@angular/platform-browser';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PaymentMethod } from 'src/app/models/paymentMethod.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {months} from "src/app/models/constants";
import { ProfileService } from 'src/app/services/api/profile.service';

@Component({
    selector: 'sportsman-data',
    templateUrl: 'sportsman-data.component.html',
    styleUrls: ['sportsman-data.component.css']
})
export class SportsmanDataComponent extends ProfileComponent implements OnInit {

    private newPaymentMethod : PaymentMethod = {name: "Nueva tarjeta", type: "", cardNumber: "", CVC: "", yearExpire: 0, monthExpire: 0}
    faPlus = faPlus;
    paymentMethodForm : FormGroup;
    months = months
    years : number[] = []

    constructor(public formBuilder: FormBuilder, title : Title, private modalService: NgbModal, private profileService : ProfileService) {
        super(title)

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

    ngOnInit() {}

    openModal(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: "lg"})
    }

    addPaymentMethod() {
        this.profileService.setNewPaymentMethod(this.newPaymentMethod).subscribe()
    }
}
