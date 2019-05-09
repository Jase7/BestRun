import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchNavbarService {

  private searchSource = new Subject<boolean>();

  clickAnnounced$ = this.searchSource.asObservable();

  constructor() { }

  // Service message commands
  announceClick(state: boolean) {
    this.searchSource.next(state);
  }
}
