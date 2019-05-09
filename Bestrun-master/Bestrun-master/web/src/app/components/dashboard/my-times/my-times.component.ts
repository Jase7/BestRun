import {Component, OnInit} from '@angular/core';
import {SearchEventModel} from "../../../models/search-event.model";
import {MyEvent} from "../../../models/my-event.model";
import {EventsService} from "../../../services/api/events.service";
import {TypeEventsService} from "../../../services/api/type-events.service";
import {SearchNavbarService} from "../../../services/search-navbar.service";
import {data} from '../../../config/data';

declare var FB: any;

@Component({
  selector: 'app-my-times',
  templateUrl: './my-times.component.html',
  styleUrls: ['./my-times.component.css']
})
export class MyTimesComponent implements OnInit {

  searchEvent = new SearchEventModel();
  typeEvents: any[] = [];
  myEvents: MyEvent[] = [];
  loading: boolean = false;
  empty: boolean = false;
  searchBoxResponsive = true;
  url: string = data.url;

  constructor(private eventsService: EventsService, private typeEventService: TypeEventsService,
              private searchNavbarService: SearchNavbarService) {
    this.searchNavbarService.clickAnnounced$.subscribe(
      (state) => {
        console.log(state);
        this.searchBoxResponsive = state;
      });
  }

  ngOnInit() {
    this.getTypesEvent();
    this.getMyEvents();
  }

  getTypesEvent() {
    this.typeEventService.getAllTypeEvent().subscribe((data: any) => {
      this.typeEvents = data;
    });
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

  searchEvents() {
    this.myEvents = [];
    this.searchEvent.page = 1;
    this.getMyEvents();
  }

  deleteFilters() {
    this.myEvents = [];
    this.searchEvent = new SearchEventModel();
    this.getMyEvents();
  }


  onScroll() {
    this.loading = true;
    if (!this.empty)
      this.searchEvent.page += 1;
    this.getMyEvents();
  }

  openFacebook(me) {
    if (me.time) {
      console.log(me);
      FB.ui({
        method: 'share',
        quote: `Mi tiempo en el evento ${me.event.tittle} es de ${me.time}!`,
        href: `${this.url}/${me.event._id}`,
      }, function (response) {
      });
    }
  }
}
