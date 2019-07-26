import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdminsService} from "../../../../services/api/admins.service";
import {NotificationType} from "angular2-notifications";
import {NotifyService} from "../../../../services/notify.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Sportsman} from "../../../../models/sportsman.model";
import {SportsmanService} from "../../../../services/api/sportsman.service";
import { DashboardComponent } from '../../dashboard.component';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-sportsman.component.html',
  styleUrls: ['./edit-sportsman.component.css']
})
export class EditSportsmanComponent implements OnInit {

  editSportsmanForm: FormGroup;
  id: number;
  sportsman: Sportsman = new Sportsman();
  myprofile : Sportsman = DashboardComponent._profile;

  constructor(public formBuilder: FormBuilder, private sportsmanService: SportsmanService, private notify: NotifyService,
              private route: ActivatedRoute,private router: Router) {
    this.editSportsmanForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      surnames: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(64), Validators.pattern("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])"), Validators.required])],
      mobileNumber: [''],
      active: [true],
      password: ['', Validators.compose([Validators.minLength(8)])],
      rol: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    if (this.id) {
      this.sportsmanService.getSportsman(this.id).subscribe(
        (sportsman) => {

          this.sportsman = sportsman;
          this.setupForm();
        },
        (error) => {
          this.notify.show(NotificationType.Error, "Error login", error.error.message);
        });
    }
  }

  setupForm() {

    this.editSportsmanForm.setValue({
       
      name: this.sportsman.name,
      surnames: this.sportsman.surnames,
      email: this.sportsman.email,
      mobileNumber: this.sportsman.mobileNumber ? this.sportsman.mobileNumber : '',
      active: this.sportsman.active,
      password:this.sportsman.password ? this.sportsman.password : '',
      rol: this.sportsman.role
    });
  }

  onSubmit() {
    let sportsman = this.editSportsmanForm.value;
    sportsman.id=this.sportsman.id;
    if(sportsman.mobileNumber==="") delete sportsman.mobileNumber;
    if(sportsman.password==="") delete sportsman.password;
    
    this.sportsmanService.editSportsman(sportsman).subscribe((data: any) => {
       
        this.notify.show(NotificationType.Success, "User created", "Usuario actualizado con éxito");
        this.router.navigate(['/sportsman/show', data.id]);
      },
      (error) => {
         
        this.notify.show(NotificationType.Error, "Error Create", error.error.message);
      });
  }
}
