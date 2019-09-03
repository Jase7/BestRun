import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/api/payment.service';
import { Payment } from 'src/app/models/payment.model';
import { SearchModel } from 'src/app/models/search.model';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, mergeMap, merge } from 'rxjs/operators';
import { NotifyService } from 'src/app/services/notify.service';
import { NotificationType } from 'angular2-notifications';


@Component({
   selector: 'app-show-payments',
   templateUrl: './show-payments.component.html',
   styleUrls: ['./show-payments.component.css']
})
export class ShowPaymentsComponent implements OnInit {

   public isCollapsed = false;
   payments: Payment[] = [];
   page = 1;
   pages = 0;
   totalItems = 0;
   pageItems = 0;
   previousPage: any;

   constructor(public paymentSvc: PaymentService, public notify : NotifyService) { }

   ngOnInit() {

      this.getPayments(this.page)
   }

   getPayments(page) {
      if (page !== this.previousPage) {
         this.previousPage = page;
         this.paymentSvc.getPayments(page).subscribe(
            (data) => {
               
               this.payments = data.docs;
               this.page = Number(data.page);
               this.pages = data.pages;
               this.totalItems = data.total;
               this.pageItems = data.limit;
            },
            (error) => {
               this.notify.show(NotificationType.Error, "Error get logs", error.error.message);
            });
      }

   }

}
