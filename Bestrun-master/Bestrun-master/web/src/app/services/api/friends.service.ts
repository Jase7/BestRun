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

     addFriend(userid: String) : Observable<any> {
        return this.http.post<any>(`${this.strFriendsApiUrl}/`, {user1: this._storage.get("userid"), user2: userid}).pipe()
    }

    acceptFriendship(id: string) {
        return this.http.put<any>(`${this.strFriendsApiUrl}/`, {id: id}).pipe()
    }

    rejectFriendship(id: string) {
        return this.http.delete<any>(`${this.strFriendsApiUrl}/${id}`).pipe()
    }

    getPendRequests() : Observable<number> {

        return this.http.get(`${this.strFriendsApiUrl}/${this._storage.get('userid')}`).pipe(map((res : any) => {
        
            //Let's filter the ones who aren't friends
           return res.data.docs.filter( (doc : any) => {                
                
                if (!doc.isFriendship) {
                    return doc
                }

             }).length
        }))
    }

    getDataFromPendRequests() : Observable<UsersFriends> {
        return this.http.get(`${this.strFriendsApiUrl}/${this._storage.get('userid')}`).pipe(map((res : any) => {

            var result =  res.data.docs.filter((user) => {

                if (!user.isFriendship) {
                    return user as UsersFriends
                }
            })
            

            return result
        }));
    }

    
} 