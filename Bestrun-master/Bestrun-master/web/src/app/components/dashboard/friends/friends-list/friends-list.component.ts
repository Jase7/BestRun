import { Component, OnInit } from '@angular/core';
import { UsersFriends } from 'src/app/models/users_friends.model';
import { FriendsService } from 'src/app/services/api/friends.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {

   private _users : UsersFriends[] = [];
   private myID : String = ""

   constructor(private _friendsService : FriendsService, private _storage : StorageService) { }

   ngOnInit() {

      this.getFriendsships();
      this.myID = this._storage.get("userid")
   }

   getFriendsships() {

      this._friendsService.getFriends().subscribe((data : UsersFriends) => {

            this._users = []
            this._users[0] = data[0]
      })
     
   }

}
