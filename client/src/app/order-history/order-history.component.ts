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
  user;
  orders;
  constructor(private _service: MainService, private _router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.user = this._service.user;
    this._service.retrieveOrder((res) => {
      this.orders = res;
      console.log(res);
    })
  }

}
