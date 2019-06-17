import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Event} from "../../models/event.model";
import {SearchEventModel} from "../../models/search-event.model";
import {data} from "../../config/data";

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  api_url = data.api;
  eventsUrl = `${this.api_url}/events`;

  constructor(private http: HttpClient) {
  }

  getEvent(id): Observable<Event> {
    return this.http.get(`${this.eventsUrl}/${id}`).pipe(
      map((res: any) => {
        return res.data as Event;
      })
    )
  }

  getAllEvent(search: SearchEventModel): Observable<any> {
    return this.http.get(`${this.eventsUrl}?page=${search.page}&search=${search.term}&type=${search.typeEvent}&city=${search.city}&month=${search.month}&limit=${search.pageSize}`).pipe(
      map(res => {
        return res["data"];
      })
    );
  }

  getMyEvents(search: SearchEventModel){
    return this.http.get(`${this.api_url}/sportsman/my-events?page=${search.page}&search=${search.term}&limit=${search.pageSize}&type=${search.typeEvent}`).pipe(
      map(res => {
        return res["data"];
      })
    );
  }

  getEventsTimeComparator(myID : String, friendID : String ) {
     return this.http.get(`${this.api_url}/sportsman/events/${myID}/${friendID}`).pipe(
        map(res => {
           return res["eventData"]
        })
     )
  }
}
