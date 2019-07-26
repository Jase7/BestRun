import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {map} from "rxjs/operators";
import {Event} from "../../models/event.model";
import {SearchModel} from "../../models/search.model";
import {Participant} from "../../models/participant.model";
import {data} from "../../config/data";

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  api_url = data.api;
  eventsUrl = `${this.api_url}/api/events`;

  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }

  createEvent(event: Event): Observable<any> {
     
    return this.http.post(`${this.eventsUrl}`, event).pipe(
      map((res: any) => {
        return res.data as Event;
      }));
  }

  getEvent(id): Observable<Event> {
    return this.http.get(`${this.eventsUrl}/${id}`).pipe(
      map((res: any) => {
        return res.data as Event;
      })
    )
  }

  getAllEvent(search: SearchModel): Observable<any> {
    return this.http.get(`${this.eventsUrl}/all?page=${search.page}&search=${search.term}&limit=${search.pageSize}`).pipe(
      map(res => {
        return res["data"];
      })
    );
  }

  editEvent(event: Event) {
    return this.http.put(`${this.eventsUrl}`, event).pipe(
      map(res => {
        return res["data"] as Event;
      })
    )
  }

  removeEvent(id: string) {
    return this.http.delete(`${this.eventsUrl}/${id}`);
  }

  uploadFile(id: string, file: File): Observable<Event> {
    const formData = new FormData();

    formData.append('document', file);

    return this.http.post(`${this.eventsUrl}/${id}/file`, formData).pipe(
      map(res => {
        return res["data"] as Event;
      }));
  }

  deleteFile(id: string): Observable<Event> {
    return this.http.delete(`${this.eventsUrl}/${id}/file`).pipe(
      map(res => {
        return res["data"] as Event;
      }));
  }

  uploadImage(id: string, file: File): Observable<Event> {
    const formData = new FormData();

    formData.append('photo', file);

    return this.http.post(`${this.eventsUrl}/${id}/photo`, formData).pipe(
      map(res => {
        return res["data"] as Event;
      }));
  }

  deleteImage(id: string): Observable<Event> {
    return this.http.delete(`${this.eventsUrl}/${id}/photo`).pipe(
      map(res => {
        return res["data"] as Event;
      }));
  }

  createParticipant(idEvent: string, idUser: string) {
    return this.http.post(`${this.eventsUrl}/${idEvent}/participant/${idUser}`, {}).pipe(
      map((res: any) => {
        return res.data;
      }));
  }

  getAllParticipants(idEvent: string, search: SearchModel): Observable<any> {
    console.log(search);
    return this.http.get(`${this.eventsUrl}/${idEvent}/participant?page=${search.page}&search=${search.term}`).pipe(
      map(res => {
        return res["data"];
      })
    )
  }

  updateParticipant(participant: Participant) {
    return this.http.put(`${this.eventsUrl}/${participant.eventId}/participant`, participant).pipe(
      map(res => {
        return res["data"] as Participant;
      })
    )
  }

  removeParticipant(participant: Participant) {
    return this.http.delete(`${this.eventsUrl}/${participant.eventId}/participant/${participant.participantId}`);
  }

}
