import { Component, OnInit } from '@angular/core';
import { MainService } from './../main.service';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "angular4-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angular4-social-login";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  current_user;
  orders= [];
  
  constructor(private _service: MainService, private _router: Router, private authService: AuthService) { }

  ngOnInit() {
    if(this._service.social_user) {
      this.current_user = this._service.social_user;
    }
    else {
      this.current_user = this._service.user;
    }
    console.log(this.current_user);
    this._service.retrieveOrder((res) => {
      this.orders = res;
      console.log(res);
    })
  }

  signOut(): void {
    this._service.logout();
    this._router.navigate(["/"]);
  }

}
