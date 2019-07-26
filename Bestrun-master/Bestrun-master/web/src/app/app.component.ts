import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NavigationEnd,  Router } from '@angular/router';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

   headerFooter : boolean;
   @ViewChild('fixedterms') d1:ElementRef;

   constructor(
      private router: Router,
      private renderer : Renderer2,
      private _storage : StorageService
    ) { }

    ngOnInit(){

      this.checkMsgTerms()

       this.router.events
       .subscribe((event) => {
         if (event instanceof NavigationEnd) {
           this.headerFooter = ((event.url !== '/login' && event.url !== '/register'))
         }
       });
    }

    checkMsgTerms() {

      if(this._storage.get('acceptTerms') == "true") {

         var msg = this.d1.nativeElement
         this.renderer.setStyle(msg, "display", "none");
      }
    }

    acceptTerms() {

      var msg = this.d1.nativeElement
      this.renderer.setStyle(msg, "display", "none");

      this._storage.add('acceptTerms', "true")
    }

}
