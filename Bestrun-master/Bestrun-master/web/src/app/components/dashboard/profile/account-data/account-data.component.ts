import { Component } from '@angular/core';
import { ProfileComponent } from '../profile.component';
import { Title } from '@angular/platform-browser';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { ProfileService } from 'src/app/services/api/profile.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { DashboardComponent } from '../../dashboard.component';

@Component({
    selector: 'account-data',
    templateUrl: 'account-data.component.html',
    styleUrls: ['account-data.component.css']
})
export class AccountDataComponent extends ProfileComponent {

    faEye = faEye;

    constructor(title : Title, private _profileService : ProfileService, private storageService : StorageService, private router : Router, private dashboard : DashboardComponent) {
        super(title)
    }

    ngOnInit() {
        this.getMyData();
    }

    getMyData() {
        this._profileService.getMyData().subscribe((res : any ) => {
            this.user = res
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
        this.user.photo = reader.result
        console.log(this.user.photo)
    }

    cambiarImagen(newPhotoString : string) {

        this._profileService.setNewProfilePhoto(newPhotoString).subscribe();
        this.storageService.change("profile_image", newPhotoString);
        this.dashboard.ngOnInit();
    }
}
