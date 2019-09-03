import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/models/event.model';
import { Inscription } from 'src/app/models/inscription.model';
import { PaymentService } from 'src/app/services/api/payment.service';
import { Address } from 'src/app/models/address.model';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit {

   paymentID : string = "";
   event : Event = new Event();
   inscription : Inscription = new Inscription();
   address : Address = new Address();

  constructor(public activatedRoute : ActivatedRoute, public paymentSvc : PaymentService) { }

  ngOnInit() { 

      this.activatedRoute.params.subscribe((params) => {
         this.paymentID = params['id'];
         this.getData(this.paymentID);         
      });
  }

  getData(paymentID) {

      this.paymentSvc.getDataFromPayment(paymentID).subscribe((res : any) => {
         this.event = res['event'];
         this.inscription = res['inscription'];
         this.address = res['address'];

         console.log(this.event);
         console.log(this.inscription);
         console.log(this.address);
         
      }, 
      (error) => {

      })


  }

}
