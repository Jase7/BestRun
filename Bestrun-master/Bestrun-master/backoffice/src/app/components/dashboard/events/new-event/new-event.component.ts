import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotifyService} from "../../../../services/notify.service";
import {Router} from "@angular/router";
import {NotificationType} from "angular2-notifications";
import {EventsService} from "../../../../services/api/events.service";
import {NgbDateStruct, NgbModal, NgbTimepickerConfig, NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";
import {TypeEventsService} from "../../../../services/api/type-events.service";
import {Inscription} from "../../../../models/inscription.model";
import {ICON_WHEATHER} from "../../../../models/icon-wheather/icon-wheather";

@Component({
  selector: 'app-new-sportsman',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent implements OnInit {

  editEventForm: FormGroup;
  time: NgbTimeStruct;
  date: NgbDateStruct;
  typeEvents: any[];
  typesInscription: Inscription[] = [];
  newInscriptionForm: FormGroup;
  inscriptionToUpdated;
  updatedInscription=false;
  icons = ICON_WHEATHER;
  iconWeather = null;
  classIcon = null;

  constructor(public formBuilder: FormBuilder, private eventsService: EventsService, private notify: NotifyService,
              private router: Router, config: NgbTimepickerConfig, private modalService: NgbModal, private typeEventService: TypeEventsService) {
    config.seconds = true;
    config.spinners = false;
  }

  ngOnInit() {

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
      description:[null],
      price: [null, Validators.compose([Validators.required])],
      taxPercentage: [0],
      active: [true]
    });
    this.getTypesEvent();
  }

  onSubmit() {

    let event = this.editEventForm.value;
    let date = new Date();

    console.log(event)

    event.celebrationDate ? date.setFullYear(event.celebrationDate.year, event.celebrationDate.month - 1, event.celebrationDate.day) : null;
    event.celebrationHour && event.celebrationDate ? date.setHours(event.celebrationHour.hour, event.celebrationHour.minute, event.celebrationHour.second) : null;
    event.celebrationDate = event.celebrationDate ? date.toISOString() : null;


    event.closeInscriptions ? date.setFullYear(event.closeInscriptions.year, event.closeInscriptions.month - 1, event.closeInscriptions.day) : null;
    event.closeInscriptionsHour && event.closeInscriptions ? date.setHours(event.closeInscriptionsHour.hour, event.closeInscriptionsHour.minute, event.closeInscriptionsHour.second) : null;
    event.closeInscriptions = event.closeInscriptions ? date.toISOString() : null;
    event.typeInscription=this.typesInscription;
    delete event.celebrationHour;
    delete event.closeInscriptionsHour;
    event.iconWeather = this.iconWeather;

    this.eventsService.createEvent(event).subscribe((data: any) => {
        // this.router.navigate(['']);
        this.notify.show(NotificationType.Success, "Event created", "Evento creado con éxito");
        this.router.navigate(['/events/show', data.id]);
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error create event", error.error.message);
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
    if(this.updatedInscription){
      this.typesInscription[this.inscriptionToUpdated]=this.newInscriptionForm.value;
      this.updatedInscription=false;
    }
    else{
      this.typesInscription.push(this.newInscriptionForm.value);
    }
    this.newInscriptionForm.reset();
  }

  editInscription(index) {
    this.updatedInscription=true;
    this.inscriptionToUpdated = index;
    this.newInscriptionForm.setValue({
      tittle: this.typesInscription[index].tittle,
      price: this.typesInscription[index].price,
      taxPercentage: this.typesInscription[index].taxPercentage,
      description: this.typesInscription[index].description?this.typesInscription[index].description:null,
      active: this.typesInscription[index].active,
    });
  }

  changeState(i){
    this.typesInscription[i].active=!this.typesInscription[i].active;
  }

  removeInscription(i){
    this.typesInscription.splice(i,1);
  }

  cancelEdit(){
    this.updatedInscription=false;
    this.newInscriptionForm.reset();
  }
}
