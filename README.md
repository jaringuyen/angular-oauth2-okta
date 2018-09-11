# angular-oauth2-okta

Okta and OpenId Connect (OIDC) Implicit Flow in Angular 6

## Create an OpenID Connect APP in Okta
[Sign up](https://developer.okta.com/signup/) and login to your Okta account.

Click on menu Applications, and click on the Add Application button. Select Single-Page App (Angular, React, etc) and click Next button. On the next page, specify http://localhost:4200 as a Base URI, Login redirect URI, and Logout redirect URI. Click Done and you should see settings like the following.

![angular-oauth2-okta](https://raw.githubusercontent.com/jaringuyen/angular-oauth2-okta/master/docs/img/angular-oauth2-okta.jpg)

Please copy YOUR-CLIENT-ID string in the bottom of the image above, and the issuer URL in format: https://dev-XXXXXX.oktapreview.com/oauth2/default

*Check Trusted Origins*

In Okta Developer Console, click on menu API -> Trusted Origins, then click on Add Origin button. Check and make sure http://localhost:4200 is listed with CORS and Redirect.

*Create User and Assign to your Application*

In Okta Developer Console, click on menu Users -> People. Click on Add Person button, enter username as an email and password.
Click Assign Applications button to assign to your application. Or you can assign to a group.

## Create an Angular Application

You will need:

- [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com/get-npm).
- [Angular CLI](https://github.com/angular/angular-cli/wiki) installed. 

Create a new Angular project

```
ng new angular-oauth2-okta
cd angular-oauth2-okta
ng serve
```

Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Create Profile component

```
ng g c profile
```

Open src/app/profile/profile.component.html, and replace it's default html with the following:

```
<h2>Profile</h2>
<div>
    Hello {{ name }}
</div>
<pre>{{ claims }}</pre>
<pre>{{ accessToken }}</pre>
<pre>{{ idToken }}</pre>
```

Open src/app/profile/profile.component.ts, and add the following:

```
    claims: string;
    accessToken: string;
    idToken: string;
```

## Install angular-oauth2-oidc

```
npm i angular-oauth2-oidc --save
```

## Create Home component

```
ng g c home
```

Open src/app/home/home.component.html, and replace with the following:

```
<div *ngIf="name">
  <h3>Welcome, {{name}}!</h3>
  <button (click)="logout()">Logout</button>
  <p><a routerLink="/profile" routerLinkActive="active">Profile</a></p>
</div>

<div *ngIf="!name">
  <button (click)="login()">Login</button>
</div>
```

Open src/app/home/home.component.ts, and replace with the following:

```
import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  name: string;
  constructor(private oauthService: OAuthService) { }

  ngOnInit() {
    const claims = this.oauthService.getIdentityClaims();
    this.name = claims != null ? claims['name'] : 'Unauthorized';
  }

    login() {
    this.oauthService.initImplicitFlow();
  }

  logout() {
    this.oauthService.logOut();
  }
}
```

## Add AuthGaurd

Create folder: src/app/shared/auth
Add a file src/app/shared/auth/auth.guard.service.ts, and replace with the following:

```
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private oauthService: OAuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.oauthService.hasValidIdToken()) {
      return true;
    }
    this.router.navigate(['/home']);
    return false;
  }
}
```

Add a file src/app/shared/index.ts with the following content:

```
export * from './auth/auth.guard.service';
```

## Importing the NgModule

Open file src/app/app.module.ts, and replace with the following:

```
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
```

Open file src/app/app.component.html, and replace with the following:

```
<div style="text-align:center">
  <h1>
    Welcome to {{ title }}!
  </h1>
</div>
<router-outlet></router-outlet>
```

Open file src/app/app.component.ts, and replace with the following:

```
import { Component } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular 6 - OAuth 2 and OpenId Connect (OIDC) - OKTA';

  constructor(private oauthService: OAuthService) {
    const authConfig = new AuthConfig();
    authConfig.issuer = 'https://dev-XXXXXX.oktapreview.com/oauth2/default';
    authConfig.clientId = 'YOUR-CLIENT-ID';
    authConfig.scope = 'openid profile email';
    authConfig.redirectUri = 'http://localhost:4200';
    authConfig.oidc = true;
    authConfig.showDebugInformation = true;
    authConfig.sessionChecksEnabled = false;
    authConfig.postLogoutRedirectUri = 'http://localhost:4200';
    this.oauthService.setStorage(localStorage);
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin({
      onTokenReceived: (info) => {
        console.log(info);
      }
    });
  }
}

```

# Run and login using Okta credentials

```
ng serve
```

Open http://localhost:4200, you will be automatically redirected to Okta to login with the Implicit Flow

# Checking Okta claims, idToken and accessToken

Open file src/app/profile/profile.component.ts, and replace with the following:

```
import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  name: string;
  claims: string;
  accessToken: string;
  idToken: string;
  constructor(private oauthService: OAuthService) { }

  ngOnInit() {
    this.claims = JSON.stringify(this.oauthService.getIdentityClaims());
    this.accessToken = JSON.stringify(this.oauthService.getAccessToken());
    this.idToken = JSON.stringify(this.oauthService.getIdToken());

    this.name = this.claims != null ? this.claims['name'] : '';
  }
}
```

