import {Component, OnInit} from '@angular/core';
import {SearchNavbarService} from "../../services/search-navbar.service";
import {AuthenticationService} from "../../services/api/authentication.service";
import {StorageService} from "../../services/storage.service";
import {Router} from "@angular/router";
import { ProfileService } from 'src/app/services/api/profile.service';
import { faHome } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  searchBoxResponsive=true;  

  private profileImage : string
  public faHome = faHome;

  constructor(private authService:AuthenticationService, private searchNavbarService:SearchNavbarService, private storageService: StorageService, 
    private router: Router, private profileService : ProfileService) {}

  ngOnInit(){    

    this.profileImage = this.storageService.get("profile_image")  
  }

  buttonSearchChange(){
    this.searchBoxResponsive=!this.searchBoxResponsive;
    this.searchNavbarService.announceClick(this.searchBoxResponsive);
  }

  signOut(){
    this.authService.signOut();
  }
}
