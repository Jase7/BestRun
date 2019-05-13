import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {data} from "../../config/data";
import { Sportsman } from "../../models/sportsman.model";

@Injectable({
  providedIn: 'root'
})

export class UsersService {

    strFriendsApiUrl = data.api + "/users"

    constructor(private http: HttpClient) {}

    getUserByName(username: String): Observable<Sportsman> {
        return this.http.get(`${this.strFriendsApiUrl}/${username}`).pipe(
          map((res : any) => {
            return res.data.docs as Sportsman;
          })
        )
    }
}