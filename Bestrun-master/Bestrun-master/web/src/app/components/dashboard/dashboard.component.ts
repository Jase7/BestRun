import {Component, OnInit} from '@angular/core';
import {SearchNavbarService} from "../../services/search-navbar.service";
import {AuthenticationService} from "../../services/api/authentication.service";
import {StorageService} from "../../services/storage.service";
import {Router} from "@angular/router";
import { Title } from '@angular/platform-browser';
import { ProfileService } from 'src/app/services/api/profile.service';
import { Sportsman } from 'src/app/models/sportsman.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  searchBoxResponsive=true;  

  private profileImage : string

  constructor(private authService:AuthenticationService, private searchNavbarService:SearchNavbarService, private storageService: StorageService, 
    private router: Router, private profileService : ProfileService) {}

  ngOnInit(){    

    this.profileImage = this.storageService.get("profile_image")

    //If we're not logged in, redirect to the login form
    if (!this.storageService.get("token_auth") || !this.storageService.get("user_role")) {
        this.router.navigate(["/login"])
    }

  }

  buttonSearchChange(){
    this.searchBoxResponsive=!this.searchBoxResponsive;
    this.searchNavbarService.announceClick(this.searchBoxResponsive);
  }

  signOut(){
    this.authService.signOut();
  }
}
