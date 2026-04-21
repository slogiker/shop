import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiUrl = `${environment.apiUrl}/shop`;

  private products: Product[] = [
    {
      name: 'Super Trump', priceBTC: 0.0021, priceETH: 0.0802, image: 'images/trump.png',
      description: 'A powerful upper that floods your brain with dopamine and delusions of grandeur. You\'ll feel like you can solve everything while everyone around you wonders what happened. Comes on like a freight train, lasts like a tweet storm.',
      reviews: [
        { username: 'xXdarkwolf99Xx', rating: 5, comment: 'Felt like I could run the country. 10/10 would govern again.' },
        { username: 'blazeit420_eu', rating: 5, comment: 'Massive energy, zero comedown. My new go-to for festivals.' },
        { username: 'pillhead_piotr', rating: 4, comment: 'Very strong, starts fast. Maybe a bit too much for beginners but love it.' }
      ]
    },
    {
      name: 'Tesla', priceBTC: 0.0023, priceETH: 0.0832, image: 'images/tesla.png',
      description: 'A smooth, electric high that supercharges every neuron. Clean energy from the first hit — your thoughts accelerate to lightspeed and your body hums like a hypercharger. The future has never felt this now.',
      reviews: [
        { username: 'techno_martin', rating: 5, comment: 'Cleanest roll I\'ve had in years. Zero anxiety, just pure electricity.' },
        { username: 'raver_katarzyna', rating: 5, comment: 'Danced for 6 hours straight. My body was a hypercharger exactly like they say.' },
        { username: 'chill_vibes_only', rating: 4, comment: 'Smooth and long lasting. Great for smaller doses if you\'re new.' }
      ]
    },
    {
      name: 'Green Snowflake', priceBTC: 0.0021, priceETH: 0.0802, image: 'images/snezinka.png',
      description: 'Melts on the tongue, melts your worries. This icy beauty delivers a gentle, crystalline euphoria — every sensation is crisp and beautiful, like snowflakes dissolving on warm skin.',
      reviews: [
        { username: 'SnowQueenElsa', rating: 5, comment: 'Exactly as described. Crisp, clean, beautiful. Perfect for a chill night in.' },
        { username: 'freezing_filip', rating: 5, comment: 'Gentlest come-up I\'ve experienced. Felt like floating in cold air.' },
        { username: 'nordic_nights88', rating: 4, comment: 'Really nice and soft. Not overwhelming at all, great for newcomers.' }
      ]
    },
    {
      name: 'Blue Clover', priceBTC: 0.0025, priceETH: 0.0850, image: 'images/blueclover.png',
      description: 'Lucky, lucky you. A rare, balanced experience — clear-headed enough to find a four-leaf clover in a field, euphoric enough to believe it\'s a sign from the universe. Smooth comedown, all-day luck.',
      reviews: [
        { username: 'lucky_laszlo', rating: 5, comment: 'Found my soulmate the night I took this. Coincidence? I think not.' },
        { username: 'balanced_beatrice', rating: 5, comment: 'The most balanced thing I\'ve ever taken. Clear head, warm heart.' },
        { username: 'all_day_vibes', rating: 5, comment: 'No crash at all. Still felt good the next morning. Rare.' }
      ]
    },
    {
      name: 'Confused Euphoria', priceBTC: 0.0022, priceETH: 0.0810, image: 'images/confusedeuphoria.png',
      description: 'You\'ll be smiling without knowing why, laughing at things that weren\'t funny, feeling profoundly connected to everyone around you. Don\'t fight the confusion — that\'s exactly where the magic lives.',
      reviews: [
        { username: 'giggling_grzegorz', rating: 5, comment: 'I laughed for two hours at a wall. Best two hours of my life.' },
        { username: 'connected_soul99', rating: 5, comment: 'Talked to every person at the party. Felt like I knew all of them forever.' },
        { username: 'why_am_i_happy', rating: 4, comment: 'Don\'t know why I was smiling, didn\'t care. Exactly what I needed.' }
      ]
    },
    {
      name: 'Infernal Impulse', priceBTC: 0.0024, priceETH: 0.0840, image: 'images/infernalimpulse.png',
      description: 'Pure fire. An intense, scorching rush that burns through every inhibition and lights up your entire nervous system. Not for the faint of heart — this one bites back, and you\'ll love every second of it.',
      reviews: [
        { username: 'hellfire_henrik', rating: 5, comment: 'Warning: this is NOT gentle. Absolutely insane rush. Loved every second.' },
        { username: 'no_fear_natasha', rating: 5, comment: 'Burned through every wall I had. Came out the other side a new person.' },
        { username: 'intense_only', rating: 5, comment: 'Other stuff feels boring after this. The real deal for experienced users.' }
      ]
    },
    {
      name: 'Lunar Wink', priceBTC: 0.0026, priceETH: 0.0860, image: 'images/lunarwink.png',
      description: 'Like the moon looking down on you with a knowing smile. A dreamy, floaty experience that makes everything glow softly in the dark. Perfect for long nights under the stars where time stops mattering.',
      reviews: [
        { username: 'stargazer_sven', rating: 5, comment: 'Lay in a field watching stars for hours. Absolutely magical experience.' },
        { username: 'moon_child_maja', rating: 5, comment: 'Time genuinely stopped. I existed completely in the present. Perfect.' },
        { username: 'dreamy_dawid', rating: 4, comment: 'Very floaty and calm. Great for introspection. Highly recommend for solo nights.' }
      ]
    },
    {
      name: 'Purple Flower', priceBTC: 0.0023, priceETH: 0.0825, image: 'images/purpleflower.png',
      description: 'Blooms slowly, peaks beautifully. This floral powerhouse starts gentle and expands into full-body euphoria — petals of sensation unfolding one by one until your whole world is in bloom.',
      reviews: [
        { username: 'garden_girl_gabi', rating: 5, comment: 'The slow bloom is real. Takes its time then absolutely flowers. Worth every minute.' },
        { username: 'petal_pusher_pp', rating: 5, comment: 'Full body warmth that just kept expanding. Cried a little (happy tears).' },
        { username: 'botanical_boris', rating: 5, comment: 'Most beautiful come-up I\'ve experienced. Like watching a flower open in your chest.' }
      ]
    },
    {
      name: 'Rainbow Unicorn', priceBTC: 0.0027, priceETH: 0.0870, image: 'images/rainbowunicorn.png',
      description: 'Rare. Mythical. Absolutely unreal. A multi-spectrum experience that hits every emotional colour at once. You\'ll genuinely question whether something this good can exist — it does, and it\'s all yours.',
      reviews: [
        { username: 'unicorn_hunter_u', rating: 5, comment: 'I\'ve been chasing this feeling for 10 years. Finally found it. Don\'t lose this product.' },
        { username: 'rainbow_renata', rating: 5, comment: 'Literally every colour of the rainbow. Impossible to describe, just do it.' },
        { username: 'mythical_mike_pl', rating: 5, comment: 'Thought people were exaggerating. They were not. This is a religious experience.' }
      ]
    }
  ];

  basketCount$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductByName(name: string): Product | undefined {
    return this.products.find(p => p.name === name);
  }

  refreshBasketCount(): void {
    this.getBasket().subscribe({
      next: items => this.basketCount$.next(items.reduce((s, i) => s + i.quantity, 0)),
      error: () => {}
    });
  }

  addToBasket(product: Product, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-to-basket`, {
      name: product.name,
      quantity,
      priceBTC: product.priceBTC,
      priceETH: product.priceETH
    }).pipe(tap(() => this.basketCount$.next(this.basketCount$.value + quantity)));
  }

  getBasket(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-basket`);
  }

  updateQuantity(name: string, quantity: number, priceBTC: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-quantity`, { name, quantity, priceBTC });
  }

  removeFromBasket(name: string, priceBTC: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove-from-basket`, { name, priceBTC });
  }

  confirmOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm-order`, orderData);
  }
}
