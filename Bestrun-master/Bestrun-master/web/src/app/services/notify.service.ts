import {Injectable} from '@angular/core';
import {NotificationsService, NotificationType} from "angular2-notifications";

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor( private _service: NotificationsService) {
  }

  show(type:NotificationType, tittle:string, message: string, timeOut = 3000) {
    this._service.create(tittle,message, type, {
      timeOut: timeOut,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    })
  }
}
