import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { CompanyRegistrationFormComponent } from './page/company-registration-form/company-registration-form.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './page/home/home.component';
import { CarComponent } from './page/car/car.component';
import { WorkersComponent } from './page/workers/workers.component';
import { ClientComponent } from './page/client/client.component';
import { FormRepairComponent } from './page/form-repair/form-repair.component';
import { CarInformationComponent } from './page/car-information/car-information.component';
import { FormInvoiceComponent } from './page/form-invoice/form-invoice.component';
import { InfofileComponent } from './page/infofile/infofile.component';
import { InvoicePage } from './page/invoice/invoice.component';
import { InfoFormComponent } from './page/info-form/info-form.component';
import { InfoforclientComponent } from './page/infoforclient/infoforclient.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirigir al home
    { path: 'login', component: LoginComponent },
    { path: 'company', component: CompanyRegistrationFormComponent },
    { path: 'home', component: HomeComponent },  // Página principal
    { path: 'car', component: CarComponent },
    { path: 'workers', component: WorkersComponent },
    { path: 'client', component: ClientComponent },
    { path: 'form', component: FormRepairComponent },
    { path: 'info/:licensePlate', component: CarInformationComponent },
    { path: 'invoice', component: FormInvoiceComponent },
    { path: 'infofile', component: InfofileComponent },
    { path: 'invoiceInfo/:invoiceId', component: InvoicePage },
    { path: 'forminfo/:id', component: InfoFormComponent },
    { path: 'infoforclient', component: InfoforclientComponent }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
