// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { SportsmanDataComponent } from './sportsman-data/sportsman-data.component';
import { AccountDataComponent } from './account-data/account-data.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
    declarations: [      
        SportsmanDataComponent,
        AccountDataComponent
    ],
    imports: [
        CommonModule,        
        ProfileRoutingModule,
        FormsModule
    ],
    exports: [
        
    ]
})
export class ProfileModule {}
