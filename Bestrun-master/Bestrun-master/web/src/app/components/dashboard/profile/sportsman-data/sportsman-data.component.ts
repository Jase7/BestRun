import { Component, OnInit } from '@angular/core';
import { ProfileComponent } from '../profile.component';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'sportsman-data',
    templateUrl: 'sportsman-data.component.html',
    styleUrls: ['sportsman-data.component.css']
})
export class SportsmanDataComponent extends ProfileComponent implements OnInit {

    constructor(title : Title) {
        super(title)
    }

    ngOnInit() {}
}
