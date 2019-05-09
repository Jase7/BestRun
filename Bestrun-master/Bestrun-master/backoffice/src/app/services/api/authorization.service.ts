import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CanActivate, Router} from "@angular/router";
import {StorageService} from "../storage.service";
import {NotificationType} from "angular2-notifications";
import {NotifyService} from "../notify.service";
import {map} from "rxjs/operators";
import {Admin} from "../../models/admin.model";
import {data} from "../../config/data";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService  implements CanActivate {

  api_url = data.api;
  authUrl = `${this.api_url}/api/auth`;
  role: string = "user_role";

  public httpOptions: any;
  constructor(private http:HttpClient, private notify: NotifyService, private storageService: StorageService,
              private router: Router) {
  }

  getProfile() {
    return this.http.get(`${this.authUrl}/profile`)
      .pipe(map((res: any) => {
        return res.data as Admin;
      }));
  }

  async getRole(){
      let data = await this.storageService.get(this.role);
      return data;
  }

  async canActivate(){
    //Ahuthorization route admins only superadmin
    let role = await this.getRole();
    if(!role)
    {
      this.router.navigate(['/sportsman']);
      return false;
    }
    return role !== 'Admin';
  }
}
