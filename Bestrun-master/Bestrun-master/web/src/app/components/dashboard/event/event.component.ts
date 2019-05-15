import {Component, OnInit} from '@angular/core';
import {SearchEventModel} from "../../../models/search-event.model";
import {months} from "../../../models/constants";
import {Event} from "../../../models/event.model";
import {EventsService} from "../../../services/api/events.service";
import {TypeEventsService} from "../../../services/api/type-events.service";
import {SearchNavbarService} from "../../../services/search-navbar.service";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  searchEvent = new SearchEventModel();
  typeEvents: any[] = [];
  allMonths = months;
  events: Event[] = [];
  loading: boolean = false;
  empty: boolean = false;
  searchBoxResponsive = true;

  constructor(private eventsService: EventsService, private typeEventService: TypeEventsService,
              private searchNavbarService: SearchNavbarService, private title : Title) {
    this.searchNavbarService.clickAnnounced$.subscribe(
      (state) => {
        console.log(state);
        this.searchBoxResponsive = state;
      });
  }

  ngOnInit() {

    this.title.setTitle("BestRun")
    this.getTypesEvent();
    this.getEvents();
  }

  getTypesEvent() {
    this.typeEventService.getAllTypeEvent().subscribe((data: any) => {
      this.typeEvents = data;
    });
  }

  getEvents() {
    console.log(this.searchEvent);
    this.eventsService.getAllEvent(this.searchEvent).subscribe(
      (data) => {
        console.log(data);
        this.events = this.events.concat(data.docs);
        this.searchEvent.page = Number(data.page);
        this.searchEvent.pages = data.pages;
        this.searchEvent.totalItems = data.total;
        this.empty = this.searchEvent.page === this.searchEvent.pages;
        console.log(this.searchEvent.page);
      }
    );
  }

  searchEvents() {
    this.events = [];
    this.searchEvent.page = 1;
    this.getEvents();
  }

  deleteFilters() {
    this.events = [];
    this.searchEvent = new SearchEventModel();
    this.getEvents();
  }

  onScroll() {
    this.loading = true;
    if (!this.empty)
      this.searchEvent.page += 1;
    this.getEvents();
  }


}
