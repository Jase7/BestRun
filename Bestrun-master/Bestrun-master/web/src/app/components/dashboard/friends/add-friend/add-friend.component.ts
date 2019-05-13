import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/api/users.service';
import { Sportsman } from 'src/app/models/sportsman.model';

@Component({
    selector: 'app-add-friend',
    templateUrl: 'add-friend.component.html',
    styleUrls: ['add-friend.component.css']
})
export class AddFriendComponent implements OnInit {

    public users : Sportsman[]  = [];
    public isHidden : boolean = true 

    constructor(private usersSvc: UsersService) {}

    ngOnInit() {}

    searchUser(name: String) {

        //reset the users and the results on the view
        if (name.length == 0) { this.users = []; }
        else { //if we have a name, let's seek it in the bd
    
            this.usersSvc.getUserByName(name).subscribe((data) => {
                this.users = [];
                this.users.push(data)
            })

        }
    }

    toggleUsers(event: Event) {
        this.isHidden = !this.isHidden;
    }
}
