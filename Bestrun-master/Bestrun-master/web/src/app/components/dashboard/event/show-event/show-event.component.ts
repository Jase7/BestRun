import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { EventsService } from "../../../../services/api/events.service";
import { NotificationType } from "angular2-notifications";
import { NotifyService } from "../../../../services/notify.service";
import { Event } from "../../../../models/event.model";
import { ShareService } from "@ngx-share/core";
import { data } from '../../../../config/data';
import { ICON_WHEATHER } from "../../../../models/icon-wheather/icon-wheather";
import { Sportsman } from 'src/app/models/sportsman.model';
import { Title } from '@angular/platform-browser';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from 'src/app/services/api/profile.service';
import { SportsmanDataComponent } from '../../profile/sportsman-data/sportsman-data.component';
import { FormBuilder } from '@angular/forms';

declare var FB: any;

@Component({
   selector: 'app-show-event',
   templateUrl: './show-event.component.html',
   styleUrls: ['./show-event.component.css']
})

export class ShowEventComponent extends SportsmanDataComponent implements OnInit {
   id: number;
   event: Event = new Event();
   url: string = data.url;
   activeTab = 'info';
   icons = ICON_WHEATHER;
   user: Sportsman = new Sportsman();   
   faPlus = faPlus;
   inscription : string = ""

   constructor(private eventsService: EventsService, private notifyService: NotifyService, private route: ActivatedRoute,
      public share: ShareService, private titleService: Title, private modalService: NgbModal, public profileService: ProfileService, private formBld : FormBuilder) {

      super(formBld, titleService, modalService, profileService, notifyService)

      this.titleService.setTitle("Información del evento")
   }

   ngOnInit() {
      this.route.params.subscribe(params => {
         this.id = params['id'];
      });
      this.getEvent();

   }

   getEvent() {
      this.eventsService.getEvent(this.id).subscribe(
         (event) => {
            this.event = event;
         },
         (error) => {
            this.notifyService.show(NotificationType.Error, "Error", "Error al obtener en el evento");
         });
   }

   changeActiveTab(tab, inscription) {
      this.activeTab = tab;
      console.log(this.activeTab)

      if (tab == 'inscriptionData') {
         this.inscription = inscription;
         this.profileService.getMyData().subscribe((res : any ) => {              
            this.user = this.profileService.user    
        });
      }

      if (tab == 'resume') {

      }
   }

   open() {
      FB.ui({
         method: 'share',
         quote: `Unete al evento ${this.event.tittle}!`,
         href: `${this.url}/event/${this.event.id}`,
      }, function (response) { });
   } 
}
