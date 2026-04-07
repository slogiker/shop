import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, Review } from '../../../models/product';
import { ShopService } from '../../../services/shop.service';
import { ToastService } from '../../../services/toast.service';
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

  selectedProduct: Product | null = null;
  modalQuantity = 1;

  constructor(private shopService: ShopService, private toast: ToastService) { }

  ngOnInit(): void {
    this.shopService.getProducts().subscribe(data => {
      this.products = data;
      this.products.forEach(p => this.quantities[p.name] = 1);
    });
  }

  openModal(product: Product) {
    this.selectedProduct = product;
    this.modalQuantity = 1;
  }

  closeModal() {
    this.selectedProduct = null;
  }

  stars(rating: number): string[] {
    return Array(5).fill('').map((_, i) => i < rating ? 'fas fa-star' : 'far fa-star');
  }

  avgRating(product: Product): number {
    if (!product.reviews?.length) return 0;
    return product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length;
  }

  addToBasket(product: Product, qty: number) {
    this.loading[product.name] = true;
    this.shopService.addToBasket(product, qty).subscribe({
      next: () => {
        this.toast.success(`${product.name} (x${qty}) added to basket!`);
        this.loading[product.name] = false;
        this.quantities[product.name] = 1;
        this.closeModal();
      },
      error: () => {
        this.toast.error('Failed to add to basket.');
        this.loading[product.name] = false;
      }
    });
  }
}
