import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.css']
})
export class ProfileComponent implements OnInit {

    constructor(private title : Title) {}

    ngOnInit() {
        this.title.setTitle("BestRun - PERFIL")
    }
}
