import {Injectable} from '@angular/core';
import {Admin} from "../../models/admin.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {map} from "rxjs/operators";
import {data} from "../../config/data";

@Injectable({
  providedIn: 'root'
})
export class AdminsService {
  api_url = data.api;
  adminsUrl = `${this.api_url}/api/admins`;

  public httpOptions: any;

  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }

  createAdmin(admin: Admin): Observable<any> {
    console.log(this.httpOptions);
    return this.http.post(`${this.adminsUrl}`, admin).pipe(
      map((res:any)  => {
        return res.data as Admin;
      }));
  }

  getAdmin(id): Observable<Admin>{
    return this.http.get(`${this.adminsUrl}/${id}`).pipe(
      map((res:any)  => {
        return res.data as Admin;
      })
    )
  }

  getAllAdmins(page:number=1): Observable<any>{
    return this.http.get(`${this.adminsUrl}?page=${page}`).pipe(
      map(res  => {
        return res["data"];
      })
    )
  }

  editAdmin(admin:Admin){
     
    return this.http.put(`${this.adminsUrl}`,admin).pipe(
      map(res  => {
        return res["data"] as Admin;
      })
    )
  }

  removeAdmin(id:string){
    return this.http.delete(`${this.adminsUrl}/${id}`);
  }
}
