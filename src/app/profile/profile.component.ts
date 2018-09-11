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
