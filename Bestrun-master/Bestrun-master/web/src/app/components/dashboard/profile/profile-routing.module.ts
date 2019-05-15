import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { AccountDataComponent } from './account-data/account-data.component';
import { SportsmanDataComponent } from './sportsman-data/sportsman-data.component';

const routes : Routes = [
    {
        path: "account-data",
        component: AccountDataComponent
    },
    {
        path: "sportsman-data",
        component: SportsmanDataComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class ProfileRoutingModule {

}