import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;
  private readonly SERVER_URL = 'https://192.168.34.242:5000';

  connect() {
    if (!this.socket) {
      this.socket = io(this.SERVER_URL);
    }
  }

  createSession(cb: (data: any) => void) {
    this.socket.emit("create-session", {}, cb);
  }

  joinSession(sessionId: string, name: string, role: "teacher" | "student", userId?: string) {
    this.socket.emit("join-session", { sessionId, role, userId, name });
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }
  studReady() {
    this.socket.emit("student-ready");
  }

  on(event: string, handler: (data: any) => void) {
    this.socket.on(event, handler);
  }

  disconnect() {
    this.socket?.disconnect();
  }
  

  once(event: string, handler: (data: any) => void) {
    this.socket.once(event, handler);
  }
}