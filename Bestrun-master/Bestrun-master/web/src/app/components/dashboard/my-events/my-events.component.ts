import {Component, OnInit} from '@angular/core';
import {EventsService} from "../../../services/api/events.service";
import {SearchEventModel} from "../../../models/search-event.model";
import {MyEvent} from "../../../models/my-event.model";
import {TypeEventsService} from "../../../services/api/type-events.service";
import {SearchNavbarService} from "../../../services/search-navbar.service";
import {data} from '../../../config/data';

declare var FB:any;

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {

  searchEvent = new SearchEventModel();
  myEvents: MyEvent[] = [];
  loading: boolean = false;
  empty: boolean = false;
  searchBoxResponsive = true;
  url:string=data.url;

  constructor(private eventsService: EventsService, private typeEventService: TypeEventsService,
              private searchNavbarService: SearchNavbarService) {
    this.searchNavbarService.clickAnnounced$.subscribe(
      (state) => {
        this.searchBoxResponsive = state;
      });
  }

  ngOnInit() {
   this.getMyEvents();
  }

  getMyEvents() {
    this.eventsService.getMyEvents(this.searchEvent).subscribe(
      (data) => {
        console.log(data);
        this.myEvents = this.myEvents.concat(data.docs);
        this.searchEvent.page = Number(data.page);
        this.searchEvent.pages = data.pages;
        this.searchEvent.totalItems = data.total;
        this.empty = this.searchEvent.page === this.searchEvent.pages;
        console.log(this.searchEvent.page);
      }
    );
  }

  onScroll() {
    this.loading = true;
    if (!this.empty)
      this.searchEvent.page += 1;
    this.getMyEvents();
  }

  openFacebook(event){
    console.log(event);
    FB.ui({
      method: 'share',
      quote: `Unete conmigo al evento ${event.tittle}!`,
      href: `${this.url}/${event._id}`,
    }, function(response){});}
}
