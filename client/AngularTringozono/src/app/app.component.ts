import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  searchTerm = '';
  isCollapsed = true;

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

  logout() {}

  search() {}
}
