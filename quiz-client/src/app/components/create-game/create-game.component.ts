import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { GroupGameService } from "src/app/services/group-game/group-game.service";
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
    groupGames: any[] = [];
    selectedGroupGameId: string = ''; 

    constructor(
        private quizSocket: QuizSocketService,
        private groupGameService: GroupGameService,
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

        // Получаем все виды игр
        this.groupGameService.getAllGroupGame().subscribe({
            next: (data) => {
                this.groupGames = data;
            },
            error: (error) => console.log("Ошибка при получении всех видов игр", error)
        });

        this.quizSocket.connect();
        this.quizSocket.onGameCreated().subscribe({
            next: (data) => {
                console.log("Получили айди игры")
                this.gameId = data.gameId
                this.router.navigate(
                    ['/lobby', this.gameId],
                    { queryParams: { groupGameId: this.selectedGroupGameId } }
                );
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
        this.quizSocket.createGame(
            this.user.id,
        );
    }
}