import { Component, OnInit } from '@angular/core';
import { Stock, StockService } from '../stock.service'
import { Router, ActivatedRoute } from '@angular/router'
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms'

@Component({
  selector: 'app-stock-form',
  templateUrl: './stock-form.component.html',
  styleUrls: ['./stock-form.component.css']
})
export class StockFormComponent implements OnInit {

  formModel: FormGroup;
  stock: Stock = new Stock(0, '', 0, 0, '', []);

  categories = ['IT', '互联网', '金融'];

  constructor(private routeInfo: ActivatedRoute, private stockService: StockService, private router: Router) { }

  ngOnInit() {
    let stockId = this.routeInfo.snapshot.params['id']

    let fb = new FormBuilder();
    this.formModel = fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', Validators.required],
      desc: [''],
      categories: fb.array([
        new FormControl(false),
        new FormControl(false),
        new FormControl(false)
      ], this.categoriesSelectValidator)
    });

    if (stockId != 0) {
      this.stockService.getStock(stockId).subscribe(
        data => {
          this.stock = data
          this.formModel.reset({
            name: data.name,
            price: data.price,
            desc: data.desc,
            categories: [
              data.categories.indexOf(this.categories[0]) != -1,
              data.categories.indexOf(this.categories[1]) != -1,
              data.categories.indexOf(this.categories[2]) != -1
            ]
          })
        }
      )
    }

  }

  categoriesSelectValidator(control: FormArray): any {
    var valid = false;
    control.controls.forEach(control => {
      if (control.value) {
        valid = true;
      }
    })
    if (valid) {
      return null;
    } else {
      return { categoriesLength: true }
    }
  }

  cancel() {
    this.router.navigateByUrl('/stock')
  }

  save() {
    var chineseCategories = [];
    var index = 0;
    for (var i = 0; i < 3; i++) {
      if (this.formModel.value.categories[i]) {
        chineseCategories[index++] = this.categories[i];
      }
    }
    this.formModel.value.categories = chineseCategories;
    this.formModel.value.rating = this.stock.rating;
    console.log(this.formModel.value)
    let stock = new Stock(
      this.routeInfo.snapshot.params['id'],
      this.formModel.value.name,
      this.formModel.value.price,
      this.formModel.value.rating,
      this.formModel.value.desc,
      this.formModel.value.categories
    );
    // console.log(stock)
    this.stockService.saveStock(stock).subscribe(
      data => {
        this.router.navigateByUrl('/stock');
      })
  }
}

