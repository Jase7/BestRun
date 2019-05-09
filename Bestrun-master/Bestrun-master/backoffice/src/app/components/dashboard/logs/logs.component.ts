import {Component, OnInit} from '@angular/core';
import {NotifyService} from "../../../services/notify.service";
import {NotificationType} from "angular2-notifications";
import {LogsService} from "../../../services/api/logs.service";

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  allLogs: any[] = [];
  page = 1;
  pages = 0;
  totalItems=0;
  pageItems=0;
  previousPage: any;

  constructor(private logsService: LogsService, private notify: NotifyService) {
  }

  ngOnInit() {
    this.getLogs(this.page);
  }

  getLogs(page:number){
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.logsService.getAllLogs(page).subscribe(
        (data) => {
          console.log(data);
          this.allLogs = data.docs;
          this.page = Number(data.page);
          this.pages = data.pages;
          this.totalItems = data.total;
          this.pageItems=data.limit;
        },
        (error) => {
          this.notify.show(NotificationType.Error, "Error get logs", error.error.message);
        });
    }
  }
}
