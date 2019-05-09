import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {map} from "rxjs/operators";
import {data} from "../../config/data";

@Injectable({
  providedIn: 'root'
})
export class TypeEventsService {
  api_url = data.api;
  eventsUrl = `${this.api_url}/api/type-events`;

  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }

  createTypeEvent(name: String): Observable<any> {
    return this.http.post(`${this.eventsUrl}`, {name:name}).pipe(
      map((res: any) => {
        return res.data;
      }));
  }

  getAllTypeEvent(): Observable<any> {
    return this.http.get(`${this.eventsUrl}`).pipe(
      map(res => {
        return res["data"];
      })
    );
  }

  removeTypeEvent(id: string) {
    return this.http.delete(`${this.eventsUrl}/${id}`);
  }
}
