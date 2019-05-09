import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AdminsService} from "../../../../services/api/admins.service";
import {NotifyService} from "../../../../services/notify.service";
import {Admin} from "../../../../models/admin.model";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationType} from "angular2-notifications";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-show-admin',
  templateUrl: './show-admin.component.html',
  styleUrls: ['./show-admin.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ShowAdminComponent implements OnInit {

  id: number;
  admin: Admin = new Admin();

  constructor(private adminsService: AdminsService, private notify: NotifyService, private route: ActivatedRoute,
              private router:Router, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.adminsService.getAdmin(this.id).subscribe(
      (admin) => {
        this.admin = admin;
        console.log(admin);
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error get admin", error.error.message);
      });

  }

  remove() {
    this.adminsService.removeAdmin(this.admin.id).subscribe(() => {
        this.notify.show(NotificationType.Success, "Correct delete", "Eliminado correctamente");
        this.router.navigate(['/admins']);
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error get admins", error.error.message);
      });
  }

  modalRemove(content) {
    this.modalService.open(content, { centered: true });
  }
}
