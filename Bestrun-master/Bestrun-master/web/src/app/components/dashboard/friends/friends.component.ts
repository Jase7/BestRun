import { Component, OnInit } from '@angular/core';
import {SearchNavbarService} from '../../../services/search-navbar.service'
import { RouteConfigLoadStart } from '@angular/router';
import { FriendsService} from 'src/app/services/api/friends.service';

@Component({
    selector: 'app-friends',
    templateUrl: 'friends.component.html',
    styleUrls: ['friends.component.css']
})

export class FriendsComponent implements OnInit {

    public pendRequests : number = 0;

    constructor(private searchNavbarService: SearchNavbarService, private _friendsService : FriendsService) {}

    ngOnInit() {
        this._friendsService.getPendRequests().subscribe((res : number) => {
            this.pendRequests = res
        });
     }     
}
