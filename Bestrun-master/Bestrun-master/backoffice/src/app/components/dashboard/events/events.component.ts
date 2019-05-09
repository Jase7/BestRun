import {Component, OnInit} from '@angular/core';
import {NotifyService} from "../../../services/notify.service";
import {NotificationType} from "angular2-notifications";
import {EventsService} from "../../../services/api/events.service";
import{Event} from "../../../models/event.model";
import {Observable, of, Subject} from "rxjs";
import {Participant} from "../../../models/participant.model";
import {SearchModel} from "../../../models/search.model";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  mergeMap,
  pluck,
  share,
  startWith
} from "rxjs/operators";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: Observable<Event[]>;
  private searchEventStream = new Subject<string>();
  private pageEventStream = new Subject<number>();
  termsEvent: string = "";
  pageEvent: number = 1;
  searchEvent = new SearchModel();
  previousPage: any;

  constructor(private eventsService: EventsService, private notify: NotifyService) {
  }

  ngOnInit() {
    const searchEventSource = this.searchEventStream
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map(searchTerm => {
          this.termsEvent = searchTerm;
          return {term: searchTerm, page: this.pageEvent}
        })
      );

    const pageEventSource = this.pageEventStream.pipe(
      map(pageNumber => {
        this.pageEvent = pageNumber;
        return {term: this.termsEvent, page: pageNumber}
      })
    );

    const source = searchEventSource
      .pipe(
        merge(pageEventSource),
        startWith({term: this.termsEvent, page: this.pageEvent}),
        mergeMap((params: { term: string, page: number, action:boolean}) => {
          this.searchEvent.term = params.term;
          this.searchEvent.page = params.page;
          return this.eventsService.getAllEvent(this.searchEvent)
            .pipe(
              // tap(() => {
              //     this.loader = false;
              //   }
              // ),
              map((response: any) => {
                console.log(response);
                this.searchEvent.page = response.page;
                this.searchEvent.pages = response.pages;
                this.searchEvent.totalItems = response.total;
                return response;
              })
            );
        }),
        catchError(error => {
          // this.loader = false;
          console.log(error);
          this.notify.show(NotificationType.Error, "Error getting events", error.error.message);
          return of(<any[]>([]));
        }),
        share()
      );

    this.events = source.pipe(
      pluck('docs')
    );
  }

  search(searchParam): void {
    // this.loader = true;
    this.searchEventStream.next(searchParam);
  }

  onPageChange(page) {
    if (page !== this.previousPage) {
      // this.loader = true;
      this.previousPage = page;
      this.pageEventStream.next(page);
    }
  }
}
