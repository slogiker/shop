import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../../services/websocket.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.scss'
})
export class ForumComponent implements OnInit {
  message = '';
  messages: any[] = [];
  username: string = '';

  constructor(
    private wsService: WebsocketService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.username = user ? user.username : 'Anonymous';
    });

    this.wsService.getMessages().subscribe(msg => {
      this.messages.push(msg);
      // Auto scroll to bottom (setTimeout to wait for view update)
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  sendMessage() {
    if (this.message.trim()) {
      this.wsService.sendMessage(this.message);
      this.message = '';
    }
  }

  scrollToBottom() {
    const container = document.getElementById('chat-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}
