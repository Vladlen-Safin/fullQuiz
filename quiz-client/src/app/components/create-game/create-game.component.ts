import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { QuizSocketService } from "src/app/services/socket/quiz-socket.service";

@Component({
    selector: 'app-create-game',
    templateUrl: './create-game.component.html',
    styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent {
    gameId: string | null = null;
    user: any;
    teacherId = 'teacher-123'; // пока просто тестовый ID

    constructor(
        private quizSocket: QuizSocketService,
        private router: Router
    ) {}

    ngOnInit() {

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                this.user = JSON.parse(storedUser);
            } catch (e) {
                console.error("Ошибка парсинга пользователя из localStorage:", e);
            }
        }

        this.quizSocket.connect();
        this.quizSocket.onGameCreated().subscribe({
            next: (data) => {
                console.log("Получили айди игры")
                this.gameId = data.gameId
                this.router.navigate(['/lobby', this.gameId]);
            },
            error: (error) => {
                console.log("Ошибка при создании игры!", error)
            }
        });
    }

    createGame() {
    if (!this.user?.id) {
        console.error("Нет ID преподавателя в user!");
        return;
    }
    this.quizSocket.createGame(this.user.id);
    }
}