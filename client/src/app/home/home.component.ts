import { Component, OnInit } from '@angular/core';
import { MainService } from './../main.service';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "angular4-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angular4-social-login";
import { SocialUser } from "angular4-social-login";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  current_user = null;
  all_foods;
  item = null;
  user: SocialUser;
  loggedIn: boolean;
  zoom: number = 12;
  lat: number = 37.335480;
  lng: number = -121.893028; 

  constructor(private _service: MainService, private _router: Router, private authService: AuthService) { }

  ngOnInit() {
    if (this._service.user) {
      this.current_user = this._service.user;
      console.log(this.current_user);
    }

    this.authService.authState.subscribe((user) => {
      this._service.social_user = user;
      localStorage.social_user = JSON.stringify(user)
      this.loggedIn = (user != null);
       console.log(user);
      if(user !== null) {
        this._service.check_user(user, (res) => {
          if(res) {
            console.log("success social login");
            this.current_user = res.user;
          }
          else {
            console.log(res);
            this._router.navigate(["/update"]);
          }
        })
      }
    });

    this._service.retrieveAllFood((res) => {
      res.map((ele)=>{
        return ele.quantity = null;
      })
      this.all_foods = res;
    })

    
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    if (this.loggedIn === true ) {
      this.authService.signOut();
      this.current_user = null;
    }
    else {
      this._service.logout();
      this.current_user = null;
    }
  }

  create_order(food) {
    const new_food = Object.assign({},food);
    // console.log(new_food);
    this._service.updateData(new_food);
    food.quantity = null;
    
  }


}
