import { Component, OnInit } from '@angular/core';
import { FriendsService} from 'src/app/services/api/friends.service';
import { UsersFriends } from 'src/app/models/users_friends.model';

@Component({
    selector: 'friend-requests',
    templateUrl: 'friend-requests.component.html',
    styleUrls: ['friend-requests.component.css']
})
export class FriendRequestsComponent implements OnInit{

    private _users : UsersFriends[] = [];

    constructor(private _friendsService : FriendsService) {}

    ngOnInit(){
        
        this.getDataFromPendRequests();
    }

    getDataFromPendRequests() {
        this._friendsService.getDataFromPendRequests().subscribe((data : UsersFriends) => {

            this._users = []
            this._users[0] = data[0]
        })
    }

    //TODO: usar notify 
    acceptFriendship(id: string) {
        console.log(id)
        this._friendsService.acceptFriendship(id).subscribe((data: any) => {
            console.log(data)
        })
    }

    //TODO: usar notify
    rejectFriendship(id: string) {

        this._friendsService.rejectFriendship(id).subscribe((data: any) => {
            console.log(data)
        })
    }
}
