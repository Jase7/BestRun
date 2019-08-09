import {Inscription} from "./inscription.model";

export class Event {
  id: string;
  tittle: string = "";
  celebrationDate: string = new Date().toISOString();
  closeInscriptions: string;
  description: string = "";
  typeEvent: string;
  categories: string = "";
  distance: string = "";
  limitInscriptions: number;
  typeInscription: Inscription[] = [];
  price: number = 0;
  taxPercentage: number = 0;
  city: string;
  location: string = "";
  photo: string = "";
  document: string;
  active: boolean = true;
  sponsored: boolean = false;
  temperature: string;
  temperatureMax: string;
  temperatureMin: string;
  chanceRain: string;
  overallStatus: string;
  iconWeather: number;
  createdAt: string = new Date().toISOString();
  showWeather: boolean;
  organizer: string = "";
  documentTitle : string = "";
}
