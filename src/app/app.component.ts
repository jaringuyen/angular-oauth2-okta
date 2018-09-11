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
