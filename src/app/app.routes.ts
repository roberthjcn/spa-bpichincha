import { Routes } from '@angular/router';
import { AccountFormComponent } from './components/account-form/account-form.component';
import { AccountComponent } from './components/account/account.component';

export const routes: Routes = [
    {
        path: 'account-list',
        component: AccountComponent
    },
    {
        path: 'account-form',
        component: AccountFormComponent
    },
    {
        path: 'account-form/:id',
        component: AccountFormComponent
    },
    { path: '', redirectTo: '/account-list', pathMatch: 'full' }
];
