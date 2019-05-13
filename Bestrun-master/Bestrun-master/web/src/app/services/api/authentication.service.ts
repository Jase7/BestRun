import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PasswordCredentials} from "../../models/password-credentials.model";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {StorageService} from "../storage.service";
import {map} from "rxjs/operators";
import {NotificationType} from "angular2-notifications";
import {NotifyService} from "../notify.service";
import {data} from "../../config/data";
import {Sportsman} from "../../models/sportsman.model";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate {

  api_url = data.api;
  authUrl = `${this.api_url}/auth`;
  token_key: string = "token_auth";
  role: string = "user_role";
  userid: string = "userid"


  constructor(private http: HttpClient, private notify: NotifyService, private storageService: StorageService,
              private router: Router) {
  }

  signIn(passwordCredentials: PasswordCredentials) {
    return this.http.post(`${this.authUrl}/signin`, passwordCredentials)
      .pipe(map((data: any) => {
        console.log(data);
        this.storageService.add(this.token_key, data.token);
        this.storageService.add(this.role, data.role);
        this.storageService.add(this.userid, data.userid);
      }));
  }

  signInFacebook(facebookToken){
    return this.http.post(`${this.authUrl}/facebook`, {code:facebookToken})
      .pipe(map((data: any) => {
        this.storageService.add(this.token_key, data.data.token);
        this.storageService.add(this.role, data.data.role);
        this.storageService.add(this.userid, data.userid);
      }));
  }

  signInGoogle(googleToken){
    console.log(googleToken);
    return this.http.post(`${this.authUrl}/google`, {code:googleToken})
      .pipe(map((data: any) => {
        this.storageService.add(this.token_key, data.data.token);
        this.storageService.add(this.role, data.data.role);
        this.storageService.add(this.userid, data.userid);
      }));
  }

  register(sportsMan: Sportsman) {
    return this.http.post(`${this.authUrl}/register`, sportsMan)
      .pipe(map((data: any) => {
        console.log(data);
        this.storageService.add(this.token_key, data.data.token);
        this.storageService.add(this.role, data.data.role);
        this.storageService.add(this.userid, data.userid);
      }));
  }

  async signOut() {
    try {
      this.storageService.clear();
      this.router.navigate(['/login']);
    } catch (e) {
      this.notify.show(NotificationType.Error, "Error", e.message)
    }
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let login = this.storageService.get(this.token_key);
    if (!login) {
      this.router.navigate(['/login'], {queryParams: {page: state.url}});
      return false;
    }
    return true;
  }
}
