import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/models/event.model';
import { EventsService } from 'src/app/services/api/events.service';
import { Observable, of, from } from 'rxjs';
import { distinct, map, filter } from 'rxjs/operators';
import { MyEvent } from 'src/app/models/my-event.model';

@Component({
   selector: 'time-comparator',
   templateUrl: 'time-comparator.component.html',
   styleUrls: ['time-comparator.component.css']
})
export class TimeComparatorComponent implements OnInit {

   private myID: String;
   private friendID: String;
   private events: MyEvent[] = [];
   private uniqueEvents: Event[] = [];
   private caption : String = "Ningún evento seleccionado"

   @ViewChild('tableBody') d1:ElementRef;

   constructor(private route: ActivatedRoute, private eventSvc: EventsService, private elementRef:ElementRef) { }

   ngOnInit() {

      this.route.params.subscribe((param: any) => {
         this.myID = param.myID;
         this.friendID = param.friendID;

         this.getEvents(this.myID, this.friendID)
      });
   }

   getEvents(myID, friendID) {

      this.eventSvc.getEventsTimeComparator(myID, friendID).subscribe((res: any) => {
         this.events = res;

         from(this.events).pipe(
            distinct(e => e.tittleEvent)
         ).subscribe(x => this.uniqueEvents.push(x.event))
      })
   }

   getTimes(eventID, eventTitle) { 
      
      this.caption = eventTitle

      let myTime = this.events.find(e => e.user._id == this.myID);
      let friendTime = this.events.find(e => e.user._id == this.friendID)

      let position = ""
      
      if (myTime.time > friendTime.time) position = "Mayor"
      else if (friendTime.time > myTime.time) position = "Menor"
      else position = "Mismo tiempo"

      var d1 = this.elementRef.nativeElement.querySelector('.tableBody');
      d1.insertAdjacentHTML('beforeend', `<tr><td>${myTime.time}</td><td>${position}</td><td>${friendTime.time}</td></tr> `);
   }
}
