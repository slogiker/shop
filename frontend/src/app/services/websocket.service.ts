import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(private socket: Socket) { }

  sendMessage(msg: string) {
    this.socket.emit('chatMessage', msg);
  }

  getMessages() {
    return this.socket.fromEvent<any>('chatMessage').pipe(map(data => data));
  }
}
