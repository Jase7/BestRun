import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {map} from "rxjs/operators";
import {data} from "../../config/data";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  api_url = data.api;
  usersUrl = `${this.api_url}/api/users`;

  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }

  getAllUsers(searchTerm: string, page: number = 1): Observable<any> {
    return this.http.get(`${this.usersUrl}?page=${page}&search=${searchTerm}`).pipe(
      map(res => {
        console.log(res);
        return res["data"];
      })
    )
  }
}
