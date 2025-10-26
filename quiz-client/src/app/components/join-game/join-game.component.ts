import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { QuizSocketService } from "src/app/services/socket/quiz-socket.service";

@Component({
    selector: 'app-join-game',
    templateUrl: './join-game.component.html',
    styleUrls: ['./join-game.component.scss']
})
export class JoinGameComponent {
    gameId = '';
    studentName = '';

    constructor(private quizSocket: QuizSocketService, private router: Router) {}

    ngOnInit() {
        this.quizSocket.connect();
    }

    joinGame() {
        if (!this.gameId || !this.studentName) return;

        // this.quizSocket.joinGame(this.gameId, this.studentName);
        // this.router.navigate(['/lobby', this.gameId]);
        this.router.navigate(['/lobby', this.gameId], {
        queryParams: { name: this.studentName }
});
    }
}