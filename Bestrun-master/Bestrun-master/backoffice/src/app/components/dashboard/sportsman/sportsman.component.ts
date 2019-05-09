import {Component, OnInit} from '@angular/core';
import {NotifyService} from "../../../services/notify.service";
import {NotificationType} from "angular2-notifications";
import {Sportsman} from "../../../models/sportsman.model";
import {SportsmanService} from "../../../services/api/sportsman.service";
import {Observable, of, Subject} from "rxjs";
import {Event} from "../../../models/event.model";
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
  selector: 'app-sportsman',
  templateUrl: './sportsman.component.html',
  styleUrls: ['./sportsman.component.css']
})
export class SportsmanComponent implements OnInit {

  sportsman: Observable<Sportsman[]>;
  private searchSportsmanStream = new Subject<string>();
  private pageSportsmanStream = new Subject<number>();
  termsSportsman: string = "";
  pageSportsman: number = 1;
  searchSportsman = new SearchModel();
  previousPage: any;

  constructor(private sportsmanService: SportsmanService, private notify: NotifyService) {
  }

  ngOnInit() {
    const searchSportsmanSource = this.searchSportsmanStream
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map(searchTerm => {
          this.termsSportsman = searchTerm;
          return {term: searchTerm, page: this.pageSportsman}
        })
      );

    const pageSportsmanSource = this.pageSportsmanStream.pipe(
      map(pageNumber => {
        this.pageSportsman = pageNumber;
        return {term: this.termsSportsman, page: pageNumber}
      })
    );

    const source = searchSportsmanSource
      .pipe(
        merge(pageSportsmanSource),
        startWith({term: this.termsSportsman, page: this.pageSportsman}),
        mergeMap((params: { term: string, page: number}) => {
          this.searchSportsman.term = params.term;
          this.searchSportsman.page = params.page;
          return this.sportsmanService.getAllSportsman(this.searchSportsman)
            .pipe(
              // tap(() => {
              //     this.loader = false;
              //   }
              // ),
              map((response: any) => {
                console.log(response);
                this.searchSportsman.page = response.page;
                this.searchSportsman.pages = response.pages;
                this.searchSportsman.totalItems = response.total;
                return response;
              })
            );
        }),
        catchError(error => {
          // this.loader = false;
          console.log(error);
          this.notify.show(NotificationType.Error, "Error getting users", error.error.message);
          return of(<any[]>([]));
        }),
        share()
      );

    this.sportsman = source.pipe(
      pluck('docs')
    );
  }

  search(searchParam): void {
    // this.loader = true;
    this.searchSportsmanStream.next(searchParam);
  }

  onPageChange(page) {
    if (page !== this.previousPage) {
      // this.loader = true;
      this.previousPage = page;
      this.pageSportsmanStream.next(page);
    }
  }
}
