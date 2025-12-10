import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product';
import { ShopService } from '../../../services/shop.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  quantities: { [key: string]: number } = {};
  loading: { [key: string]: boolean } = {};

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.shopService.getProducts().subscribe(data => {
      this.products = data;
      this.products.forEach(p => this.quantities[p.name] = 1);
    });
  }

  addToBasket(product: Product) {
    const qty = this.quantities[product.name] || 1;
    this.loading[product.name] = true;

    this.shopService.addToBasket(product, qty).subscribe({
      next: (res) => {
        alert(`${product.name} (x${qty}) added to basket!`);
        this.loading[product.name] = false;
        this.quantities[product.name] = 1; // Reset qty
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add to basket. Please login first.');
        this.loading[product.name] = false;
      }
    });
  }
}
