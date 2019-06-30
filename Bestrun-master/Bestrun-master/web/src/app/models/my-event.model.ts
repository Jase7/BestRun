import {Event} from "./event.model";
import { Sportsman } from './sportsman.model';

export class MyEvent {
  participantId: string;
  category: string;
  dorsal: string;
  event: Event;
  position: string;
  time: string;
  tittleEvent : string;
  user: Sportsman;
}
