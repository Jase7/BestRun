import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationType} from "angular2-notifications";
import {NotifyService} from "../../../../services/notify.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Event} from "../../../../models/event.model";
import {EventsService} from "../../../../services/api/events.service";
import {NgbDateStruct, NgbModal, NgbTimepickerConfig, NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";
import {TypeEventsService} from "../../../../services/api/type-events.service";
import {ICON_WHEATHER} from "../../../../models/icon-wheather/icon-wheather";

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {

  editEventForm: FormGroup;
  id: number;
  event: Event = new Event();
  time: NgbTimeStruct;
  date: NgbDateStruct;
  typeEvents: any[];

  newInscriptionForm: FormGroup;
  inscriptionToUpdated;
  updatedInscription = false;
  icons = ICON_WHEATHER;
  iconWeather = null;
  classIcon = null;

  constructor(public formBuilder: FormBuilder, private eventsService: EventsService, private notify: NotifyService,
              private route: ActivatedRoute, private router: Router, config: NgbTimepickerConfig, private modalService: NgbModal,
              private typeEventService: TypeEventsService) {
    config.seconds = true;
    config.spinners = false;
    
    this.editEventForm = this.formBuilder.group({
      tittle: [null, Validators.compose([Validators.required])],
      celebrationDate: [null],
      celebrationHour: [null],
      typeEvent: [null],
      city: [null],
      closeInscriptions: [null],
      closeInscriptionsHour: [null],
      limitInscriptions: [null],
      distance: [null],
      categories: [null],
      description: [null],
      location: [null],
      active: [true],
      temperature: [null],
      temperatureMax: [null],
      temperatureMin: [null],
      chanceRain: [null],
      overallStatus: [null],
      sponsored: [false],
      showWeather: [false],
      organizer: [null]
    });

    this.newInscriptionForm = this.formBuilder.group({
      tittle: ["", Validators.compose([Validators.required])],
      description: [null],
      price: [null, Validators.compose([Validators.required])],
      taxPercentage: [0],
      active: [true]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.getTypesEvent();
    if (this.id) {
      this.eventsService.getEvent(this.id).subscribe(
        (event) => {
          console.log(event);
          this.event = event;
          this.setupForm();
        },
        (error) => {
          this.notify.show(NotificationType.Error, "Error get event", error.error.message);
        });
    }
  }

  setupForm() {
    console.log(this.event);
    this.iconWeather = this.event.iconWeather;
    if (this.iconWeather)
      this.classIcon = `fas fa-lg ${this.icons[this.iconWeather].icon}`;
    let dateCelebration = new Date(this.event.celebrationDate);
    let dateClose = new Date(this.event.closeInscriptions);
    this.editEventForm.setValue({
      tittle: this.event.tittle,
      celebrationDate: this.event.celebrationDate ? {
        day: dateCelebration.getUTCDate(),
        month: dateCelebration.getUTCMonth() + 1,
        year: dateCelebration.getUTCFullYear()
      } : null,
      celebrationHour: this.event.celebrationDate ? {
        hour: dateCelebration.getHours(),
        minute: dateCelebration.getMinutes(),
        second: dateCelebration.getSeconds()
      } : null,
      city: this.event.city ? this.event.city : this.editEventForm.controls.city.value,
      closeInscriptions: this.event.closeInscriptions ? {
        day: dateClose.getUTCDate(),
        month: dateClose.getUTCMonth() + 1,
        year: dateClose.getUTCFullYear()
      } : null,
      closeInscriptionsHour: this.event.closeInscriptions ? {
        hour: dateClose.getHours(),
        minute: dateClose.getMinutes(),
        second: dateClose.getSeconds()
      } : null,
      typeEvent: this.event.typeEvent ? this.event.typeEvent : this.editEventForm.controls.typeEvent.value,
      limitInscriptions: this.event.limitInscriptions ? this.event.limitInscriptions : this.editEventForm.controls.limitInscriptions.value,
      distance: this.event.distance ? this.event.distance : this.editEventForm.controls.distance.value,
      categories: this.event.categories ? this.event.categories : this.editEventForm.controls.categories.value,
      description: this.event.description ? this.event.description : this.editEventForm.controls.description.value,
      location: this.event.location ? this.event.location : this.editEventForm.controls.location.value,
      temperature: this.event.temperature ? this.event.temperature : this.editEventForm.controls.temperature.value,
      temperatureMax: this.event.temperatureMax ? this.event.temperatureMax : this.editEventForm.controls.temperatureMax.value,
      temperatureMin: this.event.temperatureMin ? this.event.temperatureMin : this.editEventForm.controls.temperatureMin.value,
      chanceRain: this.event.chanceRain ? this.event.chanceRain : this.editEventForm.controls.chanceRain.value,
      overallStatus: this.event.overallStatus ? this.event.overallStatus : this.editEventForm.controls.overallStatus.value,
      active: this.event.active,
      sponsored: this.event.sponsored,
      showWeather:this.event.showWeather,
      organizer: this.event.organizer  ? this.event.organizer : this.editEventForm.controls.organizer.value
    });
    console.log(this.editEventForm);
  }

  onSubmit() {
    let event = this.editEventForm.value;
    event.id = this.event.id;
    let date = new Date();

    console.log(event);

    event.celebrationDate ? date.setFullYear(event.celebrationDate.year, event.celebrationDate.month - 1, event.celebrationDate.day) : null;
    event.celebrationHour && event.celebrationDate ? date.setHours(event.celebrationHour.hour, event.celebrationHour.minute, event.celebrationHour.second) : null;
    event.celebrationDate = event.celebrationDate ? date.toISOString() : null;


    event.closeInscriptions ? date.setFullYear(event.closeInscriptions.year, event.closeInscriptions.month - 1, event.closeInscriptions.day) : null;
    event.closeInscriptionsHour && event.closeInscriptions ? date.setHours(event.closeInscriptionsHour.hour, event.closeInscriptionsHour.minute, event.closeInscriptionsHour.second) : null;
    event.closeInscriptions = event.closeInscriptions ? date.toISOString() : null;

    event.typeInscription = this.event.typeInscription;
    console.log(event);

    event.typeEvent = event.typeEvent ? event.typeEvent : null;
    delete event.celebrationHour;
    delete event.closeInscriptionsHour;
    event.iconWeather = this.iconWeather;
    this.eventsService.editEvent(event).subscribe((data: any) => {
        console.log(data);
        this.notify.show(NotificationType.Success, "Event edited", "Evento actualizado con éxito");
        this.router.navigate(['/events/show', data.id]);
      },
      (error) => {
        console.log(error);
        this.notify.show(NotificationType.Error, "Error Create", error.error.message);
      });
  }

  setIconWeather(id) {
    this.classIcon = this.icons[id].icon;
    this.iconWeather = id;
  }

  addTypeEvent(nameType) {
    this.typeEventService.createTypeEvent(nameType).subscribe((data: any) => {
        this.typeEvents.push(data);
        this.notify.show(NotificationType.Success, "Type event created", "Typo Evento creado con éxito");
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error create type event", error.error.message);
      });
  }

  getTypesEvent() {
    this.typeEventService.getAllTypeEvent().subscribe((data: any) => {
        console.log(data);
        this.typeEvents = data;
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error get type event", error.error.message);
      });
  }

  openModal(nameModal) {
    this.modalService.open(nameModal, {centered: true});
  }

  removeTypeEvent(id) {
    this.typeEventService.removeTypeEvent(id).subscribe((data: any) => {
        this.typeEvents = this.typeEvents.filter((te) => {
          return te.id !== id
        });
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error get type event", error.error.message);
      });
  }

  manageInscription() {
    if (this.updatedInscription) {
      let id = this.event.typeInscription[this.inscriptionToUpdated]._id;
      this.event.typeInscription[this.inscriptionToUpdated] = this.newInscriptionForm.value;
      id ? this.event.typeInscription[this.inscriptionToUpdated]._id = id : null;
      this.updatedInscription = false;
    }
    else {
      this.event.typeInscription.push(this.newInscriptionForm.value);
    }
    this.newInscriptionForm.reset();
  }

  editInscription(index) {
    this.updatedInscription = true;
    this.inscriptionToUpdated = index;
    this.newInscriptionForm.setValue({
      tittle: this.event.typeInscription[index].tittle,
      price: this.event.typeInscription[index].price,
      taxPercentage: this.event.typeInscription[index].taxPercentage,
      description: this.event.typeInscription[index].description ? this.event.typeInscription[index].description : null,
      active: this.event.typeInscription[index].active,
    });
  }

  changeState(i) {
    console.log(i);
    this.event.typeInscription[i].active = !this.event.typeInscription[i].active;
  }

  removeInscription(i) {
    this.event.typeInscription.splice(i, 1);
  }

  cancelEdit() {
    this.updatedInscription = false;
    this.newInscriptionForm.reset();
  }
}
