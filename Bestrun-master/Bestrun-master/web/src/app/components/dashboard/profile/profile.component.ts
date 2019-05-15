import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Sportsman } from 'src/app/models/sportsman.model';

@Component({
    selector: 'profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.css']
})
export class ProfileComponent implements OnInit {

    public user : Sportsman = new Sportsman();

    constructor(private title : Title) {}

    ngOnInit() {
        this.title.setTitle("BestRun - PERFIL")
    }
}
