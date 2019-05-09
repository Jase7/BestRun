import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EventsService} from "../../../../services/api/events.service";
import {NotificationType} from "angular2-notifications";
import {NotifyService} from "../../../../services/notify.service";
import {Event} from "../../../../models/event.model";
import {ShareService} from "@ngx-share/core";
import {data} from '../../../../config/data';
import {ICON_WHEATHER} from "../../../../models/icon-wheather/icon-wheather";

declare var FB:any;

@Component({
  selector: 'app-show-event',
  templateUrl: './show-event.component.html',
  styleUrls: ['./show-event.component.css']
})
export class ShowEventComponent implements OnInit {
  id: number;
  event: Event = new Event();
  url:string=data.url;
  activeTab = 'info';
  icons = ICON_WHEATHER;
  constructor(private eventsService: EventsService, private notify: NotifyService, private route: ActivatedRoute,
              public share: ShareService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.getEvent();
  }

  getEvent() {
    this.eventsService.getEvent(this.id).subscribe(
      (event) => {
        this.event = event;
        console.log(event);
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error", "Error al obtener en el evento");
      });
  }

  changeActiveTab(tab) {
    this.activeTab = tab;
  }

  open(){
    FB.ui({
      method: 'share',
      quote: `Unete al evento ${this.event.tittle}!`,
      href: `${this.url}/${this.event.id}`,
    }, function(response){});}
}
