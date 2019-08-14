import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { EventsService } from "../../../../services/api/events.service";
import { NotificationType } from "angular2-notifications";
import { NotifyService } from "../../../../services/notify.service";
import { Event } from "../../../../models/event.model";
import { ShareService } from "@ngx-share/core";
import { data } from '../../../../config/data';
import { ICON_WHEATHER } from "../../../../models/icon-wheather/icon-wheather";
import { Sportsman } from 'src/app/models/sportsman.model';
import { Title } from '@angular/platform-browser';
import { faPlus, faSun } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from 'src/app/services/api/profile.service';
import { SportsmanDataComponent } from '../../profile/sportsman-data/sportsman-data.component';
import { FormBuilder } from '@angular/forms';
import { PaymentService } from 'src/app/services/api/payment.service';
import { PaymentData } from 'src/app/models/paymentData';
import { Address } from 'src/app/models/address.model';
import { Inscription } from 'src/app/models/inscription.model';

declare var FB: any;

@Component({
   selector: 'app-show-event',
   templateUrl: './show-event.component.html',
   styleUrls: ['./show-event.component.css']
})

export class ShowEventComponent extends SportsmanDataComponent implements OnInit {
   id: number;
   event: Event = new Event();
   url: string = data.url;
   activeTab = 'info';
   icons = ICON_WHEATHER;
   user: Sportsman = new Sportsman();
   faPlus = faPlus;
   inscription: string = ""
   address: string = "";
   currentIcon: string = ""
   currentIconText: string = "";
   paymentData: PaymentData = new PaymentData();
   addresses: Address[] = [];

   //Selected
   inscriptionSelected: Inscription = new Inscription();
   addressSelected: Address = new Address();
   shippingCosts: number;

   constructor(private eventsService: EventsService, private notifyService: NotifyService, private route: ActivatedRoute,
      public share: ShareService, private titleService: Title, private modalService: NgbModal, public profileService: ProfileService, private formBld: FormBuilder,
      public paymentService: PaymentService, public router : Router) {

      super(formBld, titleService, modalService, profileService, notifyService)

      this.titleService.setTitle("Información del evento")
   }

   ngOnInit() {
      this.route.params.subscribe(params => {
         this.id = params['id'];
      });

      this.getEvent().subscribe(
         (event) => {
            this.event = event;
            console.debug(this.event)
            this.currentIcon = this.icons.find(x => x.id == event.iconWeather).icon;
            this.currentIconText = this.icons.find(x => x.id == event.iconWeather).text;
         },
         (error) => {
            this.notifyService.show(NotificationType.Error, "Error", "Error al obtener en el evento");
         }
      )

      this.getAddresses().subscribe(
         (addresses) => {
            this.addresses = addresses.addresses
         },
         (error) => {
            this.notifyService.show(NotificationType.Error, "Error", "Error al obtener las direcciones");
         }
      )
   }

   getAddresses() {
      return this.profileService.getMyData();
   }


   getEvent() {
      return this.eventsService.getEvent(this.id);
   }

   changeActiveTab(tab, inscription) {

      this.activeTab = tab;

      if (tab == 'inscriptionData') {

         this.inscription = this.inscription != '' ? this.inscription : inscription._id
         this.inscriptionSelected = Object.keys(this.inscriptionSelected).length != 0 ? this.inscriptionSelected : inscription
         this.shippingCosts = this.inscriptionSelected.shippingCosts

         this.profileService.getMyData().subscribe((res: any) => {
            this.user = this.profileService.user
         });
      }

      //get paymentData
      if (tab == 'resume') {

         if (this.checkResumeTabAfterGo()) {

            //Comprobamos la dirección
            if (this.address != 'NAID') {

               this.addressSelected = this.addresses.find(e => e._id == this.address)
            }
            else {
               //try to get any address of the current user
               if (this.user.addresses[0]) {

                  this.addressSelected = this.user.addresses[0];
                  this.notifyService.show(NotificationType.Info, "Querido usuario", "Aunque has seleccionado que no te hagamos el envío, hemos recogido algunos de tus datos de Roll&Race para que no tengas ningún problema cuando vayas a recoger tu dorsal.", 30000)
               }
               else {
                  this.notifyService.show(NotificationType.Info, "Querido usuario", "No hemos encontrado datos tuyos para poder continuar con la compra, debes crear una nueva 'Dirección' en tus datos aunque luego nosotros no vamos a realizar ningún envío. Necesitamos tus datos para avisar a la organización y que te puedan entregar el dorsal", 30000)
                  this.router.navigate(['/profile/sportsman-data'])
               }
            }

            this.paymentService.getData(this.addressSelected, this.event, this.inscriptionSelected, this.user).subscribe((res) => {
               this.paymentData = res['data'];
            })
         }

         else {

            this.notifyService.show(NotificationType.Error, "Error", "No ha seleccionado una opción")
            this.activeTab = "inscriptionData"
         }
      }
   }

   checkResumeTabAfterGo() {

      if (this.address !== "" && this.inscriptionSelected !== null) {
         return true;
      }
      else {
         return false;
      }
   }

   selectAddress(aid) {

      if (aid === 'NAID') {
         this.address = aid
         this.inscriptionSelected.shippingCosts = 0

      } else {
         this.address = aid
         this.inscriptionSelected.shippingCosts = this.shippingCosts
      }
   }

   open() {
      FB.ui({
         method: 'share',
         quote: `Unete al evento ${this.event.tittle}!`,
         href: `${this.url}/event/${this.event.id}`,
      }, function (response) { });
   }

   //For normal submit
   submit(e) {

      e.preventDefault();
   }

   downloadDocument() {

      this.eventsService.getFile(this.event.id).subscribe((resultBlob : any) => {
         var data = this.convertBase64ToBlobData(resultBlob['data'])

         if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
            window.navigator.msSaveOrOpenBlob(data, this.event.documentTitle);
         } else { // chrome
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            // window.open(url, '_blank');
            const link = document.createElement('a');
            link.href = url;
            link.download = this.event.documentTitle;
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
         }

      });
   }

   convertBase64ToBlobData(base64Data: string, contentType: string='application/pdf', sliceSize=512) {
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
   
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
   
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
   
        const byteArray = new Uint8Array(byteNumbers);
   
        byteArrays.push(byteArray);
      }
   
      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    }
}
