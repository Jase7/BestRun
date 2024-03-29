export class Event {
  id: string;
  tittle: string = "";
  celebrationDate: string = new Date().toISOString();
  closeInscriptions: string;
  description: string = "";
  typeEvent:string;
  categories: string = "";
  distance: string = "";
  limitInscriptions: number;
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
  showWeather: boolean;
  createdAt: string = new Date().toISOString();
  documentTitle: string = "";
}
