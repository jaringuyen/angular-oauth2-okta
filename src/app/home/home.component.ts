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
    this.name = claims != null ? claims['name'] : '';
  }

  login() {
    this.oauthService.initImplicitFlow();
  }

  logout() {
    this.oauthService.logOut();
  }
}
