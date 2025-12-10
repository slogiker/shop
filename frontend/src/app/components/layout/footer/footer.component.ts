import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterLinksComponent } from '../../shared/footer/footer-links/footer-links.component';
import { SocialIconsComponent } from '../../shared/footer/social-icons/social-icons.component';
import { Link } from '../../../models/link';
import { Image } from '../../../models/image';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FooterLinksComponent, SocialIconsComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  quickLinks: Link[] = [
    { url: '/shop', text: 'Browse Products' },
    { url: '/forum', text: 'Community Forum' },
    { url: '/login', text: 'Member Login' }
  ];

  supportLinks: Link[] = [
    { url: '/faq', text: 'FAQ' },
    { url: '/terms', text: 'Terms & Conditions' },
    { url: '/privacy', text: 'Privacy Policy' }
  ];

  socialIcons: Image[] = [
    { src: 'fab fa-facebook-f', alt: 'Facebook' },
    { src: 'fab fa-twitter', alt: 'Twitter' },
    { src: 'fab fa-instagram', alt: 'Instagram' },
    { src: 'fab fa-discord', alt: 'Discord' },
    { src: 'fab fa-telegram-plane', alt: 'Telegram' }
  ];
}
