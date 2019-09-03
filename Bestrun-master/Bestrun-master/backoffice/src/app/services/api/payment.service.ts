import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { data } from '../../config/data';
import { SearchModel } from 'src/app/models/search.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class PaymentService {

   api_url = data.api;

   constructor(private http: HttpClient) { }

   getPayments(page : number) : Observable<any> {
      return this.http.get(`${this.api_url}/api/payment?page=${page}`).pipe(
         map(res  => {
            
            return res["data"];
          })
      );
   }

   getDataFromPayment(paymentID : String) {
      return this.http.get(`${this.api_url}/api/payment/${paymentID}`).pipe();
   }
}
