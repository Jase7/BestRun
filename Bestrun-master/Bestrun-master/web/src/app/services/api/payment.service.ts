import { Injectable } from '@angular/core';
import { data } from 'src/app/config/data';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { getLocaleDateFormat } from '@angular/common';

@Injectable({
   providedIn: 'root'
})
export class PaymentService {

   strPaymentApi = data.api + "/payment"
   redsysURL = "https://sis-t.redsys.es:25443/sis/realizarPago";

   constructor(private http: HttpClient) { }

   getData(address, event, inscription, user) {
      return this.http.put(`${this.strPaymentApi}/`, {address: address, event: event, inscription: inscription, user: user}).pipe();
   }
}
