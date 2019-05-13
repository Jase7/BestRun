import { Component, OnInit, INJECTOR, Inject, PLATFORM_ID, Injector } from '@angular/core';
import { UsersService } from 'src/app/services/api/users.service';
import { FriendsService } from 'src/app/services/api/friends.service';
import { Sportsman } from 'src/app/models/sportsman.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-add-friend',
    templateUrl: 'add-friend.component.html',
    styleUrls: ['add-friend.component.css']
})
export class AddFriendComponent implements OnInit {

    public users : Sportsman[]  = [];
    public isHidden : boolean = true 

    //Modal
    public username: string = ""
    public userid: string = ""

    constructor(private usersSvc: UsersService, private modalService: NgbModal, private friendsService : FriendsService){
    }

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

    //Hide/Show the founded users' list
    toggleUsers(event: Event) {
        this.isHidden = !this.isHidden;
    }

    //Open modal for stablish friendship
    modalFriendship(content, userid: string, username: string) {

        this.userid = userid
        this.username = username

        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
    }

    //Triggered by OK modal, send friendship
    addFriend(userid: string) {

        console.log(userid)

        this.friendsService.addFriend(userid);
    }
}
