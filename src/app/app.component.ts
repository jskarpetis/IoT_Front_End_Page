import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../services/globals.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [],
})
export class AppComponent {
  pageTitle = 'IoT Project';
  loading: boolean = false;
  loggedIn: boolean = true;

  constructor(public globalService: GlobalsService) {}
}
