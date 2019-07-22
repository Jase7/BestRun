import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { data } from "../../config/data";
import { StorageService } from 'src/app/services/storage.service';
import { UsersFriends } from 'src/app/models/users_friends.model';
import { Sportsman } from 'src/app/models/sportsman.model';

@Injectable({
   providedIn: 'root'
})

export class FriendsService {

   strFriendsApiUrl = data.api + "/friends"

   constructor(private http: HttpClient, private _storage: StorageService) { }

   addFriend(userid: String): Observable<any> {
      return this.http.post<any>(`${this.strFriendsApiUrl}/`, { user1: this._storage.get("userid"), user2: userid }).pipe()
   }

   acceptFriendship(id: string) {
      return this.http.put<any>(`${this.strFriendsApiUrl}/`, { id: id }).pipe()
   }

   rejectFriendship(id: string) {
      return this.http.delete<any>(`${this.strFriendsApiUrl}/${id}`).pipe()
   }

   deleteFriend(id : string) {
      return this.http.delete<any>(`${this.strFriendsApiUrl}/friend/${this._storage.get("userid")}/${id}`).pipe();
   }

   //GET: Number of the pend request for the badge
   getPendRequests(): Observable<number> {

      return this.http.get(`${this.strFriendsApiUrl}/pending/${this._storage.get('userid')}`).pipe(map((res: any) => {

         console.log(res)

         //Let's filter the ones who aren't friends
         return res.data.docs.filter((doc: any) => {

            console.log(doc)

            if (!doc.isFriendship)
               return doc
         }).length
      }));
   }

   //GET: Friends-list
   getFriends(): Observable<Sportsman[]> {

      return this.http.get(`${this.strFriendsApiUrl}/${this._storage.get('userid')}`).pipe(map((res: any) => {

         var result: Sportsman[] = res.data.docs.map((user) => {

            if (user.userTo._id == this._storage.get('userid')) {

               return user.userSent as Sportsman
            }
            else return user.userTo as Sportsman
         })

         console.log("result...")
         console.log(result)

         return result as Sportsman[]
      }));
   }

   //GET: Pend-requests
   getDataFromPendRequests(): Observable<UsersFriends> {
      return this.http.get(`${this.strFriendsApiUrl}/pending/${this._storage.get('userid')}`).pipe(map((res: any) => {

         var result = res.data.docs.filter((user) => {
            return user;
         })

         return result
      }));
   }


} 