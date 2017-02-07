import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';//import router module

//import the components
import { AppComponent }   from '../app.component';
// import { LandingPageComponent } from '../component/landing-page/landing-page.component';
import { BioAppLandingComponentComponent } from '../component/bio-app-landing-component/bio-app-landing-component.component';


// Route Configuration
export const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
     { path: 'dashboard', component: BioAppLandingComponentComponent },
    
];

//define an array of routes which is of type Routes 
export const routing: ModuleWithProviders = RouterModule.forRoot(routes);