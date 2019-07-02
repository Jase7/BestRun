import { Component, OnInit } from '@angular/core';
import { FriendsService} from 'src/app/services/api/friends.service';
import { UsersFriends } from 'src/app/models/users_friends.model';
import { NotifyService } from 'src/app/services/notify.service';
import { NotificationType } from 'angular2-notifications';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'friend-requests',
    templateUrl: 'friend-requests.component.html',
    styleUrls: ['friend-requests.component.css']
})
export class FriendRequestsComponent implements OnInit{

    private _users : UsersFriends[] = [];

    constructor(private _friendsService : FriendsService, public notify : NotifyService) {}

    ngOnInit(){
        
        this.getDataFromPendRequests();
    }

    getDataFromPendRequests() {
        this._friendsService.getDataFromPendRequests().subscribe((data : UsersFriends) => {

            this._users = []
            this._users[0] = data[0]
        })
    }

    //TODO: quitar ese bloque de la página 
    acceptFriendship(id: string, card) {
        this._friendsService.acceptFriendship(id).subscribe(
           (data: any) => {
              this.notify.show(NotificationType.Success, "Petición enviada", "Has aceptado la solicitud de amistad");
              card.remove()
            },
            (error) => this.notify.show(NotificationType.Error, "Error", "Ha habido un error aceptado la solicitud de amistad")
        )
    }

    //TODO: quitar ese bloque de la página
    rejectFriendship(id: string, card) {

        this._friendsService.rejectFriendship(id).subscribe(
           (data: any) => {
              this.notify.show(NotificationType.Success, "Petición enviada", "Has rechazado la solicitud de amistad")
              card.remove()
            },
            (error) => this.notify.show(NotificationType.Error, "Error", "Ha habido un error rechazando la solicitud de amistad"))
    }
}
