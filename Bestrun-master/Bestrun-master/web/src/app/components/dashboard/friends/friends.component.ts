import { Component, OnInit } from '@angular/core';
import {SearchNavbarService} from '../../../services/search-navbar.service'
import { RouteConfigLoadStart } from '@angular/router';

@Component({
    selector: 'app-friends',
    templateUrl: 'friends.component.html',
    styleUrls: ['friends.component.css']
})

export class FriendsComponent implements OnInit {

    constructor(private searchNavbarService: SearchNavbarService) {}

    ngOnInit() { }     
}
