import { Routes } from '@angular/router';
import { HomeComponent } from './components/features/home/home.component';
import { ShopComponent } from './components/features/shop/shop.component';
import { ForumComponent } from './components/features/forum/forum.component';
import { LoginComponent } from './components/features/auth/login/login.component';
import { RegisterComponent } from './components/features/auth/register/register.component';
import { BasketComponent } from './components/features/basket/basket.component';
import { ProfileComponent } from './components/features/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'forum', component: ForumComponent },
    { path: 'shop', component: ShopComponent, canActivate: [AuthGuard] },
    { path: 'basket', component: BasketComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: '' }
];
