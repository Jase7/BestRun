import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PasswordCredentials} from "../../models/password-credentials.model";
import {CanActivate, Router} from "@angular/router";
import {StorageService} from "../storage.service";
import {map} from "rxjs/operators";
import {NotificationType} from "angular2-notifications";
import {NotifyService} from "../notify.service";
import {Admin} from "../../models/admin.model";
import {data} from "../../config/data";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate {

  api_url = data.api;
  authUrl = `${this.api_url}/api/auth`;
  token_key: string = "token_auth";
  role: string = "user_role";


  constructor(private http: HttpClient, private notify: NotifyService, private storageService: StorageService,
              private router: Router) {
  }

  signIn(passwordCredentials: PasswordCredentials) {
    return this.http.post(`${this.authUrl}/signin`, passwordCredentials)
      .pipe(map((data: any) => {
        this.storageService.add(this.token_key, data.token);
        this.storageService.add(this.role, data.role);
      }));
  }

  async signOut() {
    try {
      this.storageService.clear();
      this.router.navigate(['/auth']);
    } catch (e) {
      this.notify.show(NotificationType.Error, "Error", e.message)
    }
  }

  getProfile() {
    return this.http.get(`${this.authUrl}/profile`)
      .pipe(map((res: any) => {
        return res.data as Admin;
      }));
  }

  async canActivate() {
    let login = this.storageService.get(this.token_key);
    if (!login) {
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }
}
