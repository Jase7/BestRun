import {Component, OnInit} from '@angular/core';
import {SearchNavbarService} from "../../services/search-navbar.service";
import {AuthenticationService} from "../../services/api/authentication.service";
import {StorageService} from "../../services/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  searchBoxResponsive=true;

  constructor(private authService:AuthenticationService,private searchNavbarService:SearchNavbarService, private storageService: StorageService, private router: Router){

  }

  ngOnInit(){

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
