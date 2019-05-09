import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {map} from "rxjs/operators";
import {Sportsman} from "../../models/sportsman.model";
import {SearchModel} from "../../models/search.model";
import {data} from "../../config/data";

@Injectable({
  providedIn: 'root'
})
export class SportsmanService {
  api_url = data.api;
  sportsmanUrl = `${this.api_url}/api/sportsman`;

  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }

  createSportsman(sportsman: Sportsman): Observable<any> {
    return this.http.post(`${this.sportsmanUrl}`, sportsman).pipe(
      map((res:any)  => {
        return res.data as Sportsman;
      }));
  }

  getSportsman(id): Observable<Sportsman>{
    return this.http.get(`${this.sportsmanUrl}/${id}`).pipe(
      map((res:any)  => {
        return res.data as Sportsman;
      })
    )
  }

  getAllSportsman(search: SearchModel): Observable<any>{
    return this.http.get(`${this.sportsmanUrl}?page=${search.page}&search=${search.term}`).pipe(
      map(res  => {
        return res["data"];
      })
    )
  }

  editSportsman(sportsman:Sportsman){
    return this.http.put(`${this.sportsmanUrl}`,sportsman).pipe(
      map(res  => {
        return res["data"] as Sportsman;
      })
    )
  }

  removeSportsman(id:string){
    return this.http.delete(`${this.sportsmanUrl}/${id}`);
  }
}
