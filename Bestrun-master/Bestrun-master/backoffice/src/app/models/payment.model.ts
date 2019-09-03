import { Sportsman } from "./sportsman.model";
import { Event } from "./event.model";
import { Inscription } from "./inscription.model";

export class Payment {
   user : Sportsman = new Sportsman();
   event : Event = new Event();
   createdAt : Date = new Date();
   status : String = "";
   address : Object = new Object();
   typeInscription : Inscription = new Inscription();
   price : number = 0;
   shippingCosts : number = 0;
   sending : boolean = false;
   paymentOrder : String = "";
}