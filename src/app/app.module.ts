import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './router/bio-app-routing';//import router file

import { AppComponent } from './app.component';
import { BioAppLandingComponentComponent } from './component/bio-app-landing-component/bio-app-landing-component.component';
import { BioAppHeaderComponentComponent } from './component/bio-app-header-component/bio-app-header-component.component';

@NgModule({
  declarations: [
    AppComponent,
    BioAppLandingComponentComponent,
    BioAppHeaderComponentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
