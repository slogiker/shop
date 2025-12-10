import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiUrl = '/shop';

  // Hardcoded from legacy shop.html
  private products: Product[] = [
    { name: 'Super Trump', priceBTC: 0.0021, priceETH: 0.0802, image: '/images/trump.png' },
    { name: 'Tesla', priceBTC: 0.0023, priceETH: 0.0832, image: '/images/tesla.png' },
    { name: 'Green Snowflake', priceBTC: 0.0021, priceETH: 0.0802, image: '/images/snezinka.png' },
    { name: 'Blue Clover', priceBTC: 0.0025, priceETH: 0.0850, image: '/images/blueclover.png' },
    { name: 'Confused Euphoria', priceBTC: 0.0022, priceETH: 0.0810, image: '/images/confusedeuphoria.png' },
    { name: 'Infernal Impulse', priceBTC: 0.0024, priceETH: 0.0840, image: '/images/infernalimpulse.png' },
    { name: 'Lunar Wink', priceBTC: 0.0026, priceETH: 0.0860, image: '/images/lunarwink.png' },
    { name: 'Purple Flower', priceBTC: 0.0023, priceETH: 0.0825, image: '/images/purpleflower.png' },
    { name: 'Rainbow Unicorn', priceBTC: 0.0027, priceETH: 0.0870, image: '/images/rainbowunicorn.png' }
  ];

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductByName(name: string): Product | undefined {
    return this.products.find(p => p.name === name);
  }

  addToBasket(product: Product, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-to-basket`, {
      name: product.name,
      quantity,
      priceBTC: product.priceBTC,
      priceETH: product.priceETH
    });
  }

  getBasket(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-basket`);
  }

  confirmOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm-order`, orderData);
  }
}
