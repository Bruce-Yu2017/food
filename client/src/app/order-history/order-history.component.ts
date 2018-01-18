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
    console.log(this._service.social_user);
    console.log(this._service.user);

    if(this._service.social_user !== undefined) {
      this.current_user = this._service.social_user;
    }
    else {
      this.current_user = this._service.user;
    }

    
    this._service.retrieveOrder((res) => {
      this.orders = res;
      
    })
  }

  signOut() {
    if (this._service.social_user !== undefined) {
      console.log(1);
      this._service.logout();
      this.authService.signOut();
      this._router.navigate(["/login"]);
    }
    if (this._service.user !== undefined) {
      console.log(2);
      this._service.logout();
      this._router.navigate(["/login"]);
    }
    
    
  }

}
