import {Component, OnInit} from '@angular/core';
import {AdminsService} from "../../../services/api/admins.service";
import {NotifyService} from "../../../services/notify.service";
import {NotificationType} from "angular2-notifications";
import {Admin} from "../../../models/admin.model";

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit {

  allAdmins: Admin[] = [];
  page = 1;
  pages = 0;
  totalItems=0;
  pageItems=0;
  previousPage: any;

  constructor(private adminsService: AdminsService, private notify: NotifyService) {
  }

  ngOnInit() {
    this.getAdmins(this.page);
  }

  getAdmins(page:number){
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.adminsService.getAllAdmins(page).subscribe(
        (data) => {
          this.allAdmins = data.docs;
          this.page = Number(data.page);
          this.pages = data.pages;
          this.totalItems = data.total;
          this.pageItems=data.limit;
        },
        (error) => {
          this.notify.show(NotificationType.Error, "Error get admin", error.error.message);
        });
    }
  }
}
