import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthFacebookService {

  constructor(private http:HttpClient) {
    // FB.init({
    //   appId      : '2710923765615144',
    //   status     : false, // the SDK will attempt to get info about the current user immediately after init
    //   cookie     : false,  // enable cookies to allow the server to access
    //   // the session
    //   xfbml      : false,  // With xfbml set to true, the SDK will parse your page's DOM to find and initialize any social plugins that have been added using XFBML
    //   version    : 'v2.8' // use graph api version 2.5
    // });
  }

  // fbLogin() {
  //   return new Promise((resolve, reject) => {
  //     FB.login(result => {
  //       if (result.authResponse) {
  //         return this.http.post(`http://localhost:3000/api/v1/auth/facebook`, {access_token: result.authResponse.accessToken})
  //           .toPromise()
  //           .then(response => {
  //             var token = response.headers.get('x-auth-token');
  //             if (token) {
  //               localStorage.setItem('id_token', token);
  //             }
  //             resolve(response.json());
  //           })
  //           .catch(() => reject());
  //       } else {
  //         reject();
  //       }
  //       console.log(result);
  //     }, {scope: 'public_profile,email'})
  //   });
  // }

  logout() {
    localStorage.removeItem('id_token');
  }

  isLoggedIn() {
    // return new Promise((resolve, reject) => {
    //   this.getCurrentUser().then(user => resolve(true)).catch(() => reject(false));
    // });
  }

  getCurrentUser() {
    // return new Promise((resolve, reject) => {
    //   return this.http.get(`http://localhost:3000/api/v1/auth/me`).toPromise().then(response => {
    //     resolve(response.json());
    //   }).catch(() => reject());
    // });
  }
}
