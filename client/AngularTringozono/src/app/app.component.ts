import { Component } from '@angular/core';

import { DataService } from './data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  searchTerm = '';
  isCollapsed = true;

  constructor(private router: Router, private data: DataService) {
    //this.data.getProfile();
  }

  //authentication
  get token() {
      return localStorage.getItem('token');
  }

  //control menu
  collapse() {
      this.isCollapsed = true;
  }

  //nav bar
  closeDropdown(dropdown) {
      dropdown.close();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }

  search() {}
}
