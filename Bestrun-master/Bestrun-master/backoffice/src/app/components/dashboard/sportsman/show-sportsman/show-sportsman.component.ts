import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NotifyService} from "../../../../services/notify.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationType} from "angular2-notifications";
import {Sportsman} from "../../../../models/sportsman.model";
import {SportsmanService} from "../../../../services/api/sportsman.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-show-sportsman',
  templateUrl: './show-sportsman.component.html',
  styleUrls: ['./show-sportsman.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ShowSportsmanComponent implements OnInit {

  id: number;
  sportsman: Sportsman = new Sportsman();

  constructor(private sportsmanService: SportsmanService, private notify: NotifyService, private route: ActivatedRoute,
              private router:Router, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.sportsmanService.getSportsman(this.id).subscribe(
      (sportsman) => {
        this.sportsman = sportsman;
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error get sportsman", error.error.message);
      });

  }

  remove() {
    this.sportsmanService.removeSportsman(this.sportsman.id).subscribe(() => {
        this.notify.show(NotificationType.Success, "Correct delete", "Eliminado correctamente");
        this.router.navigate(['/sportsman']);
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error removing", error.error.message);
      });
  }

  modalRemove(content) {
    this.modalService.open(content, { centered: true });
  }
}
