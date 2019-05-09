import {Component, OnInit} from '@angular/core';
import {SearchNavbarService} from "../../services/search-navbar.service";
import {AuthenticationService} from "../../services/api/authentication.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  searchBoxResponsive=true;

  constructor(private authService:AuthenticationService,private searchNavbarService:SearchNavbarService){

  }

  ngOnInit(){}

  buttonSearchChange(){
    this.searchBoxResponsive=!this.searchBoxResponsive;
    this.searchNavbarService.announceClick(this.searchBoxResponsive);
  }

  signOut(){
    this.authService.signOut();
  }
}
