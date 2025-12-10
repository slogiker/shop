import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopService } from '../../../services/shop.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class BasketComponent implements OnInit {
  basketItems: any[] = [];
  loading = true;
  submitting = false;
  checkoutForm: FormGroup;
  error = '';
  success = false;
  totalBTC = 0;
  totalETH = 0;

  constructor(
    private shopService: ShopService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      billingStreet: ['', Validators.required],
      billingCity: ['', Validators.required],
      billingPostal: ['', Validators.required],
      billingCountry: ['', Validators.required],
      shippingStreet: ['', Validators.required],
      shippingCity: ['', Validators.required],
      shippingPostal: ['', Validators.required],
      shippingCountry: ['', Validators.required],
      paymentMethod: ['btc', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadBasket();
  }

  loadBasket() {
    this.shopService.getBasket().subscribe({
      next: (items) => {
        // Enrich items with prices from product catalog
        this.basketItems = items.map(item => {
          const product = this.shopService.getProductByName(item.name);
          return {
            ...item,
            priceBTC: product?.priceBTC || 0,
            priceETH: product?.priceETH || 0
          };
        });
        this.calculateTotals();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  calculateTotals() {
    this.totalBTC = this.basketItems.reduce((sum, item) => sum + (item.priceBTC * item.quantity), 0);
    this.totalETH = this.basketItems.reduce((sum, item) => sum + (item.priceETH * item.quantity), 0);
  }

  onSubmit() {
    if (this.checkoutForm.valid && this.basketItems.length > 0) {
      this.submitting = true;
      this.error = '';
      this.shopService.confirmOrder(this.checkoutForm.value).subscribe({
        next: () => {
          this.success = true;
          this.submitting = false;
          this.basketItems = [];
        },
        error: (err) => {
          this.error = err.error?.message || 'Order failed';
          this.submitting = false;
        }
      });
    }
  }
}
