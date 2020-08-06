import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './Components/home/home.component';
import { UserComponent } from './Components/user/user.component';
import { MainNavComponent } from './Components/other/main-nav/main-nav.component';
import { MaterialModule } from './Modules/material/material.module';
import { DashboradComponent, ImageDialogComponent,  } from './Components/dashborad/dashborad.component';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    HomeComponent,
    DashboradComponent,
    ImageDialogComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    FlexLayoutModule,
    BrowserAnimationsModule
  ],entryComponents:[ImageDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
