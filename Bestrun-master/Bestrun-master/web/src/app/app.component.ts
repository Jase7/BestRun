import { Component } from '@angular/core';
import { NavigationEnd,  Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

   headerFooter : boolean;

   constructor(
      private router: Router,
    ) { }

    ngOnInit(){

       this.router.events
       .subscribe((event) => {
         if (event instanceof NavigationEnd) {
           this.headerFooter = ((event.url !== '/login' && event.url !== '/register'))
         }
       });
    }

}
