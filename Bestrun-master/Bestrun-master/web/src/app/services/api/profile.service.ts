import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {data} from "../../config/data";
import { Sportsman } from "../../models/sportsman.model";
import { StorageService } from '../storage.service';
import { NotifyService } from '../notify.service';
import { PaymentMethod } from 'src/app/models/paymentMethod.model';
import { AuthenticationService } from './authentication.service';

@Injectable()

export class ProfileService {

    api_url = data.api + "/profile"    
    public user : Sportsman = new Sportsman();
   
    constructor(private http : HttpClient, private storage : StorageService, private notify : NotifyService, private authentication : AuthenticationService) {}

    getMyData() : Observable<Sportsman> {
        return this.http.get(`${this.api_url}/${this.storage.get("userid")}`).pipe(map((res : any) => {
            this.user = res.data
            return res.data as Sportsman
        }));
    }

    setNewProfilePhoto(newPhotoString : string) : Observable<any> {

        return this.http.put(`${this.api_url}/photo/${this.storage.get("userid")}`, {srcPhoto: newPhotoString}).pipe(map((res : any) => {
            return res;
        }));
    }

    setNewEmail(newEmail : string) : Observable<any> {

        return this.http.put(`${this.api_url}/email/${this.storage.get("userid")}`, {newEmail: newEmail}).pipe(map((res : any) => {
            return res;
        }));
    }

    setNewPassword(oldPwd : string, newPwd : string) : Observable<any> {

        return this.http.put(`${this.api_url}/password/${this.storage.get("userid")}`, {strOldPassword: oldPwd, strNewPassword: newPwd}).pipe(map((res : any) => {
            return res;
        }));
    }

    getPaymentMethods() : Observable<any> {

        return this.http.get(`${this.api_url}/paymentMethod/${this.storage.get("userid")}`).pipe(map((res : any) => {
            
            return res.data.docs[0].paymentMethods;
        }));
    }

    setNewPaymentMethod(payment : PaymentMethod) : Observable<any> {           

        return this.http.post(`${this.api_url}/paymentMethod/${this.storage.get("userid")}`, {paymentMethod: payment}).pipe();
    }

    deletePaymentMethod(PID : string) {
        
        return this.http.delete(`${this.api_url}/paymentMethod/${this.storage.get("userid")}/${PID}`).pipe();
    }

    deleteAccount() {
        return this.http.delete(`${this.api_url}/deleteAccount/${this.storage.get("userid")}`).pipe(map((res : any) => {

            this.storage.clear();
            this.authentication.signOut();
        }));
    }

    saveAddressAndShirtSize(address : String, shirtsize : String) {

        return this.http.put(`${this.api_url}/addressandshirt/${this.storage.get("userid")}`, {address: address, shirtsize: shirtsize}).pipe()
    }
 }