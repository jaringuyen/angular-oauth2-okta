import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { AuthGuard } from './shared';

import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
          sendAccessToken: true
      }
    })
  ],
  providers: [
    AuthGuard,
    OAuthService,
    { provide: OAuthStorage, useValue: localStorage }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
