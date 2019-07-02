import { Component, OnInit } from '@angular/core';
import {SearchNavbarService} from '../../../services/search-navbar.service'
import { FriendsService} from 'src/app/services/api/friends.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-friends',
    templateUrl: 'friends.component.html',
    styleUrls: ['friends.component.css']
})

export class FriendsComponent implements OnInit{

    public pendRequests : number = 0;

    constructor(private searchNavbarService: SearchNavbarService, private _friendsService : FriendsService, private title : Title) {}

    ngOnInit() {
        this.title.setTitle("Roll&Race - AMIGOS")

        this._friendsService.getPendRequests().subscribe((res : number) => {
            this.pendRequests = res
        });
    }   
    
    getPendRequest() {

        this._friendsService.getPendRequests().subscribe((res : number) => {
            this.pendRequests = res
        });
    }


}
