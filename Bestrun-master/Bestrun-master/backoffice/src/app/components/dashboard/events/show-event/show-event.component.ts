import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NotifyService} from "../../../../services/notify.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationType} from "angular2-notifications";
import {Event} from "../../../../models/event.model";
import {EventsService} from "../../../../services/api/events.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Observable, of, Subject} from "rxjs";
import {
  catchError, debounceTime, distinctUntilChanged, map, merge, mergeMap, pluck, share, startWith,
  switchMap, tap
} from "rxjs/operators";
import {UsersService} from "../../../../services/api/users.service";
import {SearchModel} from "../../../../models/search.model";
import {Participant} from "../../../../models/participant.model";
import {TypeEventsService} from "../../../../services/api/type-events.service";
import {ICON_WHEATHER} from "../../../../models/icon-wheather/icon-wheather";

@Component({
  selector: 'app-show-event',
  templateUrl: './show-event.component.html',
  styleUrls: ['./show-event.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ShowEventComponent implements OnInit, AfterViewInit {

  id: number;
  event: Event = new Event();
  fileName: string;

  user: any;
  usersData: any;
  formatterUser: any;

  participants: Observable<Participant[]>;
  private searchParticipantStream = new Subject<string>();
  private pageParticipantStream = new Subject<number>();
  private actionParticipantStream = new Subject<boolean>();
  termsParticipant: string = "";
  pageParticipant: number = 1;
  actionParticipant: boolean = false;
  searchParticipant = new SearchModel();
  previousPage: any;

  participantToRemove: Participant;

  inputLabel = 'Selecciona un archivo';

  typeEvent:any;

  icons = ICON_WHEATHER;

  constructor(private eventsService: EventsService, private notify: NotifyService, private route: ActivatedRoute,
              private router: Router, private modalService: NgbModal, private usersService: UsersService, private typeEventService: TypeEventsService) {
    this.usersData = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(searchTerm => {
          return searchTerm === '' ? of([]) :
            this.usersService.getAllUsers(searchTerm).pipe(
              map(res => {
                return res.docs
              }),
              catchError(() => {
                return of([]);
              }));
        })
      );
    this.formatterUser = (x: { name: string, surnames: string }) => {
      return `${x.name} ${x.surnames}`
    };
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.getEvent();

    const searchParticipantSource = this.searchParticipantStream
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map(searchTerm => {
          this.termsParticipant = searchTerm;
          return {term: searchTerm, page: this.pageParticipant, action: this.actionParticipant}
        })
      );

    const pageParticipantSource = this.pageParticipantStream.pipe(
      map(pageNumber => {
        this.pageParticipant = pageNumber;
        return {term: this.termsParticipant, page: pageNumber, action: this.actionParticipant}
      })
    );

    const actionParticipantSource = this.actionParticipantStream.pipe(
      map(action => {
        this.actionParticipant = action;
        return {term: this.termsParticipant, page: this.pageParticipant, action: this.actionParticipant}
      })
    );

    const source = searchParticipantSource
      .pipe(
        merge(pageParticipantSource),
        merge(actionParticipantSource),
        startWith({term: this.termsParticipant, page: this.pageParticipant, action: this.actionParticipant}),
        mergeMap((params: { term: string, page: number, action: boolean }) => {
          this.searchParticipant.term = params.term;
          this.searchParticipant.page = params.page;
          return this.eventsService.getAllParticipants(this.event.id, this.searchParticipant)
            .pipe(
              // tap(() => {
              //     this.loader = false;
              //   }
              // ),
              map((response: any) => {
                console.log(response);
                this.searchParticipant.page = response.page;
                this.searchParticipant.pages = response.pages;
                this.searchParticipant.totalItems = response.total;
                return response;
              })
            );
        }),
        catchError(error => {
          // this.loader = false;
          console.log(error);
          this.notify.show(NotificationType.Error, "Error getting participant", error.error.message);
          return of(<any[]>([]));
        }),
        share()
      );

    this.participants = source.pipe(
      pluck('docs')
    );

  }

  ngAfterViewInit() {
    this.getEvent();
  }

  search(searchParam): void {
    // this.loader = true;
    this.searchParticipantStream.next(searchParam);
  }

  onAction(): void {
    // this.loader = true;
    this.actionParticipantStream.next(!this.actionParticipant);
  }

  onPageChange(page) {
    if (page !== this.previousPage) {
      // this.loader = true;
      this.previousPage = page;
      this.pageParticipantStream.next(page);
    }
  }

  getEvent() {
    this.eventsService.getEvent(this.id).subscribe(
      (event) => {
        this.event = event;
        console.log(this.event);
        this.getTypesEvent();
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error get event", error.error.message);
      });
  }

  removeEvent() {
    this.eventsService.removeEvent(this.event.id).subscribe(() => {
        this.notify.show(NotificationType.Success, "Correct delete", "Eliminado correctamente");
        this.router.navigate(['/events']);
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error removing", error.error.message);
      });
  }

  addParticipantEvent() {
    this.eventsService.createParticipant(this.event.id, this.user.id).subscribe(
      (user) => {
        this.notify.show(NotificationType.Success, "Correct added", `Usuario ${user.nameUser} añadido`);
        this.onAction();
        this.user = null;
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error adding", error.error.message);
      });
  }

  updateParticipant(participant) {
    console.log(participant)
    this.eventsService.updateParticipant(participant).subscribe(
      (updatedParticipant) => {
        this.notify.show(NotificationType.Success, "Correct updated", `Datos ${updatedParticipant.nameUser} actualizados`);
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error adding values", error.error.message);
      });
  }

  removeParticipant() {
    this.eventsService.removeParticipant(this.participantToRemove).subscribe(() => {
        this.onAction();
        this.notify.show(NotificationType.Success, "Correct delete", "Participante eliminado correctamente");
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error removing", error.error.message);
      });
  }

  openModal(nameModal) {
    this.modalService.open(nameModal, {centered: true});
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    this.fileName = file.name;
  }

  uploadFile(imageInput: any) {
    const file: File = imageInput.files[0];
    console.log(file);

    this.eventsService.uploadFile(this.event.id, file).subscribe(
      (event) => {
        this.event = event;
        this.notify.show(NotificationType.Success, "Correct upload", "Documento subido correctamente");
      },
      (error) => {
        console.log(error);
        this.notify.show(NotificationType.Error, "Error upload", "Tamaño máximo del fichero");
      })
  }

  deleteFile() {
    this.eventsService.deleteFile(this.event.id).subscribe(
      (event) => {
        this.event = event;
        this.notify.show(NotificationType.Success, "Correct deleted", "Documento eliminado correctamente");
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error delete document", error.error.message);
      })
  }

  uploadImage(files) {
    console.log(files);
    let file = files[0];
    // const reader = new FileReader();
    // reader.onload = (e: any) => {
    //   this.event.photo = e.target.result;
    // };
    // reader.readAsDataURL(file);
    this.eventsService.uploadImage(this.event.id, file).subscribe(
      (event) => {
        this.event = event;
        this.notify.show(NotificationType.Success, "Correct upload", "Imagen subida correctamente");
      },
      (error) => {
        console.log(error);
        this.notify.show(NotificationType.Error, "Error upload", "Tamaño máximo de la imagen (5mb)");
      })
  }

  deleteImage() {
    this.eventsService.deleteImage(this.event.id).subscribe(
      (event) => {
        console.log(event);
        this.event = event;
        this.notify.show(NotificationType.Success, "Correct deleted", "Imagen eliminada correctamente");
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error delete", error.error.message);
      })
  }

  getTypesEvent() {
    this.typeEventService.getAllTypeEvent().subscribe((data: any) => {
        console.log(data);
        let filter = data.filter(te=>{return te.id===this.event.typeEvent});
        if(filter.length>0)
          this.typeEvent=filter[0];
      },
      (error) => {
        this.notify.show(NotificationType.Error, "Error get type event", error.error.message);
      });
  }
}
