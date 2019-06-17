import { Component } from '@angular/core';
import { ProfileComponent } from '../profile.component';
import { Title } from '@angular/platform-browser';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { ProfileService } from 'src/app/services/api/profile.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { DashboardComponent } from '../../dashboard.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationType } from 'angular2-notifications';
import { NotifyService } from 'src/app/services/notify.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'account-data',
    templateUrl: 'account-data.component.html',
    styleUrls: ['account-data.component.css']
})
export class AccountDataComponent extends ProfileComponent {

    faEye = faEye;
    emailForm : FormGroup;
    passwordForm : FormGroup;   

    constructor(public formBuilder: FormBuilder, title : Title, _profileService : ProfileService, private storageService : StorageService, 
        private dashboard : DashboardComponent, private notify : NotifyService, modal : NgbModal) {

        super(title, modal,_profileService)
        
        this.emailForm = this.formBuilder.group({            
            email: [{value: this.user.email, disabled:false}, Validators.compose([Validators.minLength(3), Validators.maxLength(64), Validators.pattern("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])"), Validators.required])],
            emailConfirm: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(64), Validators.pattern("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])"), Validators.required])]
        });

        this.passwordForm = this.formBuilder.group({
            oldpassword: ['', Validators.compose([Validators.minLength(8), Validators.required])],
            newpassword: ['', Validators.compose([Validators.minLength(8), Validators.required])],
            newpasswordconfirm: ['', Validators.compose([Validators.minLength(8), Validators.required])]
        });
    }    

    ngOnInit() {     
        this.getMyData()
    }
    

    getMyData() {
        this.profileService.getMyData().subscribe((res : any ) => {              
            this.user = this.profileService.user    
        });
    }

    readImage(input: any) {
        var file = input.dataTransfer ? input.dataTransfer.files[0] : input.target.files[0];
        var reader : FileReader = new FileReader();
        var pattern = /image-*/

        if (!file.type.match(pattern)) {
            alert("invalid format");
            return;
        }

        reader.onload = this._handleReaderLoaded.bind(this)
        reader.readAsDataURL(file);        
    }

    _handleReaderLoaded(e) {
        let reader = e.target;
        this.profileService.user.photo = reader.result
    }

    cambiarImagen(newPhotoString : string) {

        this.profileService.setNewProfilePhoto(newPhotoString).subscribe();
        this.storageService.change("profile_image", newPhotoString);
        this.dashboard.ngOnInit();
    }

    setNewEmail(newEmail) {
        this.profileService.setNewEmail(newEmail).subscribe((data : any) => {
            this.notify.show(NotificationType.Info, "Email", "El email ha sido cambiado correctamente")
            this.emailForm.reset();
        }, 
        (error) => {
            this.notify.show(NotificationType.Error, "Error", "El email ya está siendo utilizado en otra cuenta")
        });        
    }

    setNewPassword(oldPwd, newPwd) {
        this.profileService.setNewPassword(oldPwd, newPwd).subscribe((data : any) => {            
            this.notify.show(NotificationType.Info, "Contraseña", "La contraseña ha sido cambiada correctamente");
            this.passwordForm.reset();
        },
        (error) => {
            this.notify.show(NotificationType.Error, "Error", `Has introducido una contraseña incorrecta ${error.error.error}`)
        });
    }

    seePassword(input : any) {        
        input.type = (input.type == "password") ? "text" : "password"
    }

}
