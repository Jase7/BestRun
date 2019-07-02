import { Component, OnInit, Injectable, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Sportsman } from 'src/app/models/sportsman.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from 'src/app/services/api/profile.service';

@Component({
    selector: 'profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.css']
})
export class ProfileComponent implements OnInit {
    
    protected user : Sportsman = new Sportsman();

    constructor(private title : Title, protected modal : NgbModal, protected profileService : ProfileService) {}

    ngOnInit() {
        this.title.setTitle("Roll&Race - PERFIL")
    }

    openModal(content) {
        this.modal.open(content);
    }

    deleteAccount() {
        this.profileService.deleteAccount().subscribe();
    }   
}
