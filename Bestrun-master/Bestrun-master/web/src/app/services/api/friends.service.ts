import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {data} from "../../config/data";
import { StorageService} from 'src/app/services/storage.service';
import { UsersFriends } from 'src/app/models/users_friends.model';

@Injectable({
 providedIn: 'root'
})

export class FriendsService {

    strFriendsApiUrl = data.api + "/friends"

    constructor(private http: HttpClient, private _storage : StorageService) {}

    addFriend(userid: String) {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `${this._storage.get('token_auth')}`
            })
        };

        return this.http.post<any>(`${this.strFriendsApiUrl}/`, {user1: this._storage.get("userid"), user2: userid}, httpOptions).subscribe()
    }

    getPendRequests() : Observable<number> {

        return this.http.get(`${this.strFriendsApiUrl}/${this._storage.get('userid')}`).pipe(map((res : any) => {
             console.log(res.data.docs.length )
             return res.data.docs.length
        }))
    }
}