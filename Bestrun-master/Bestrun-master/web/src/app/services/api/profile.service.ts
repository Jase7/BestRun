import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {data} from "../../config/data";
import { Sportsman } from "../../models/sportsman.model";
import { StorageService } from '../storage.service';

@Injectable({
    providedIn: 'root'
})

export class ProfileService {

    api_url = data.api + "/profile"
   
    constructor(private http : HttpClient, private storage : StorageService) {}

    getMyData() : Observable<Sportsman> {
        return this.http.get(`${this.api_url}/${this.storage.get("userid")}`).pipe(map((res : any) => {

            return res.data as Sportsman
        }));
    }

    setNewProfilePhoto(newPhotoString : string) : Observable<any> {

        return this.http.put(`${this.api_url}/${this.storage.get("userid")}`, {srcPhoto: newPhotoString}).pipe(map((res : any) => {
            return res;
        }));
    }
}