import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {data} from "../../config/data";

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  api_url = data.api;
  eventsUrl = `${this.api_url}/api/logs`;

  constructor(private http: HttpClient) {
  }

  getAllLogs(page:number=1): Observable<any> {
    return this.http.get(`${this.eventsUrl}?page=${page}`).pipe(
      map(res => {
        return res["data"];
      })
    );
  }
}
