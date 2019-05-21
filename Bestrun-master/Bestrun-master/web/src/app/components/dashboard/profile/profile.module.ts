// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { SportsmanDataComponent } from './sportsman-data/sportsman-data.component';
import { AccountDataComponent } from './account-data/account-data.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import { ProfileService } from 'src/app/services/api/profile.service';

@NgModule({
    declarations: [      
        SportsmanDataComponent,
        AccountDataComponent
    ],
    imports: [
        CommonModule,        
        ProfileRoutingModule,
        ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
        FormsModule,
        FontAwesomeModule,
        NgbTooltipModule
    ],
    exports: [
        
    ],
    providers: [
        ProfileService
    ]
})
export class ProfileModule {}
