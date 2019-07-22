import { Component, OnInit } from '@angular/core';
import { UsersFriends } from 'src/app/models/users_friends.model';
import { FriendsService } from 'src/app/services/api/friends.service';
import { StorageService } from 'src/app/services/storage.service';
import { Sportsman } from 'src/app/models/sportsman.model';
import { NotifyService } from 'src/app/services/notify.service';
import { NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {

   private _users : Sportsman[] = [];
   private myID : String = ""

   constructor(private _friendsService : FriendsService, private _storage : StorageService, private notify : NotifyService) { }

   ngOnInit() {

      this.getFriendsships();
      this.myID = this._storage.get("userid")
   }

   getFriendsships() {

      this._friendsService.getFriends().subscribe((data : any) => {

            this._users = []
            this._users = data   
      })  
   }

   deleteFriendship(fid) {

      this._friendsService.deleteFriend(fid).subscribe((data) => {
         this.notify.show(NotificationType.Success, "Se ha borrado la amistad", "")
      },
      (error) => {
         this.notify.show(NotificationType.Error, "Error", "No se ha podido borrar la amistad")
      })
   }

}
