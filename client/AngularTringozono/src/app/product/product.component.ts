import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: any; // store product information

  constructor(
    private activateRoute: ActivatedRoute,
    private data: DataService,
    private rest: RestApiService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(res => {
      this.rest.get(`http://localhost:3030/api/product/${res['id']}`)
        .then(data => { 
          data['success']
          ? (this.product = data['product'])
          : this.router.navigate(['/']);
        })
        .catch(error => this.data.error(error['message']));
    })
  }
}
