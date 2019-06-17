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
import { SearchNavbarService } from 'src/app/services/search-navbar.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'src/app/services/token-interceptor.service';

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
        ProfileService, 
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ]
})
export class ProfileModule {}
