import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/models/event.model';
import { EventsService } from 'src/app/services/api/events.service';

@Component({
    selector: 'time-comparator',
    templateUrl: 'time-comparator.component.html',
    styleUrls: ['time-comparator.component.css']
})
export class TimeComparatorComponent implements OnInit {

   private myID : String; 
   private friendID : String; 
   private events : Event[] = [];

   constructor(private route : ActivatedRoute, private eventSvc : EventsService) {}

   ngOnInit() {

      this.route.params.subscribe((param : any) => {
         this.myID = param.myID;
         this.friendID = param.friendID;

         this.getEvents(this.myID, this.friendID)
      });
   }

   getEvents(myID, friendID) {

      this.eventSvc.getEventsTimeComparator(myID, friendID).subscribe((res : any) => {
         console.log(res)
         this.events = res;
      })
   }

   getTimes(eventID) {
 
   }
}
