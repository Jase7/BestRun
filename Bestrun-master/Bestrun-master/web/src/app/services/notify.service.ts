import {Injectable} from '@angular/core';
import {NotificationsService, NotificationType} from "angular2-notifications";

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor( private _service: NotificationsService) {
  }

  show(type:NotificationType, tittle:string, message: string) {
    this._service.create(tittle,message, type, {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    })
  }
}
