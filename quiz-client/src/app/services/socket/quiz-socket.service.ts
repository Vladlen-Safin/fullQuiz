import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { WindowEnvHelper } from 'src/app/helpers/window-env.helper';

@Injectable({
  providedIn: 'root'
})
export class QuizSocketService {
  private socket!: Socket;
  private readonly SERVER_URL = WindowEnvHelper.getValue<string>('backUrl');

  connect(): void {
    console.log("1. ФУНКЦИЯ КОННЕКТА ");
    if (!this.socket) {
      this.socket = io(this.SERVER_URL, {
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log("✅ Успешно подключились к сокету, ID:", this.socket.id);
      });

      this.socket.on('connect_error', (err) => {
        console.error("❌ Ошибка подключения к сокету:", err.message);
      });
    }
  }
  // === Преподаватель создаёт игру ===
  createGame(teacherId: string): void {
    console.log("2. Функция создания игры", teacherId)
    this.socket.emit('createGame', { teacherId });
  }

  onGameCreated(): Observable<{ gameId: string }> {
    console.log("3. функция onGameCreated")
    return new Observable(observer => {
      this.socket.on('gameCreated', data => observer.next(data));
    });
  }

  // === Студент подключается ===
  joinGame(gameId: string, studentName: string): void {
    this.socket.emit('joinGame', { gameId, studentName });
  }

  onStudentJoined(): Observable<{ students: any[] }> {
    return new Observable(observer => {
      this.socket.on('studentJoined', data => observer.next(data));
    });
  }

  onStudentLeft(): Observable<{ student: any }> {
    return new Observable(observer => {
      this.socket.on('studentLeft', data => observer.next(data));
    });
  }

  // === Завершение игры ===
  endGame(gameId: string): void {
    this.socket.emit('endGame', { gameId });
  }

  onGameEnded(): Observable<{ results: any[] }> {
    return new Observable(observer => {
      this.socket.on('gameEnded', data => observer.next(data));
    });
  }

  // === Вопросы и ответы ===
  startQuestion(gameId: string, questionId: string): void {
    this.socket.emit('startQuestion', { gameId, questionId });
  }

  onNewQuestion(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('newQuestion', data => observer.next(data));
    });
  }

  sendStudentAnswer(gameId: string, studentName: string, selected: string[]): void {
    this.socket.emit('studentAnswer', { gameId, studentName, selected });
  }

  onShowCorrectAnswer(): Observable<{ correctAnswers: string[] }> {
    return new Observable(observer => {
      this.socket.on('showCorrectAnswer', data => observer.next(data));
    });
  }

  showAnswer(gameId: string): void {
    this.socket.emit('showAnswer', { gameId });
  }

  nextQuestion(gameId: string, questionId: string): void {
    this.socket.emit('nextQuestion', { gameId, questionId });
  }

  onStudentAnswered(): Observable<{ studentName: string }> {
    return new Observable(observer => {
      this.socket.on('studentAnswered', data => observer.next(data));
    });
  }
}
