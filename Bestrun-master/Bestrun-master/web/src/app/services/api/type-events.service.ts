import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {data} from "../../config/data";

@Injectable({
  providedIn: 'root'
})
export class TypeEventsService {
  api_url = data.api;
  eventsUrl = `${this.api_url}/type-events`;

  constructor(private http: HttpClient) {
  }

  getAllTypeEvent(): Observable<any> {
    return this.http.get(`${this.eventsUrl}`).pipe(
      map(res => {
        return res["data"];
      })
    );
  }
}
