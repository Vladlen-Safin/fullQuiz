import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { QuizSocketService } from "src/app/services/socket/quiz-socket.service";
import { HttpClient } from "@angular/common/http";
import { QuestionService } from "src/app/services/question/question.service";

@Component({
    selector: "app-lobby",
    templateUrl: "./lobby.component.html",
    styleUrls: ["./lobby.component.scss"],
})
export class LobbyComponent implements OnInit {
    gameId!: string;
    students: any[] = [];
    user: any;
    isTeacher = false;

    groupGameId!: string;
    filteredQuestions: any[] = [];

    questions: any[] = [];
    currentQuestionIndex = 0;
    currentQuestion: any = null;

    answersReceived: string[] = [];
    correctAnswers: string[] = [];
    gameEnded = false;
    results: any[] = [];

    loadingQuestions = false;

    constructor(
        private route: ActivatedRoute,
        private quizSocket: QuizSocketService,
        private questionService: QuestionService
    ) {}

    ngOnInit() {
        this.quizSocket.connect();

        this.user = JSON.parse(localStorage.getItem("user") || "{}");
        this.gameId = this.route.snapshot.paramMap.get("id")!;
        this.isTeacher = this.user?.role === "teacher";

        this.quizSocket.onStudentJoined().subscribe(({ students }) => {
        this.students = students;
        });

        this.quizSocket.onStudentLeft().subscribe(({ student }) => {
        this.students = this.students.filter((s) => s.name !== student.name);
        });

        this.quizSocket.onNewQuestion().subscribe((question) => {
        this.currentQuestion = question;
        this.correctAnswers = [];
        this.answersReceived = [];
        });

        this.quizSocket.onStudentAnswered().subscribe(({ studentName }) => {
        this.answersReceived.push(studentName);
        });

        this.quizSocket.onShowCorrectAnswer().subscribe(({ correctAnswers }) => {
        this.correctAnswers = correctAnswers;
        });

        this.quizSocket.onGameEnded().subscribe(({ results }) => {
        this.results = results;
        this.gameEnded = true;
        });

        // 🔹 Если преподаватель — загружаем банк вопросов
        if (this.isTeacher) {
            // this.loadQuestions();
            this.route.queryParamMap.subscribe(params => {
                this.groupGameId = params.get('groupGameId')!;
                console.log('Получен groupGameId:', this.groupGameId);

                // загружаем вопросы и фильтруем
                this.loadQuestions();
            });
        }
    }

    /** Загрузка всех вопросов */
    loadQuestions() {
        this.loadingQuestions = true;
        this.questionService.allQuestion().subscribe({
            next: (data) => {
                this.questions = data;
                this.filteredQuestions = data.filter(q => q.gameGroupId === this.groupGameId);
                console.log('Отфильтрованные вопросы:', this.filteredQuestions);
                this.loadingQuestions = false;
            },
            error: () => {
                this.loadingQuestions = false;
            },
        });
    }

    /** Преподаватель начинает игру с выбранного вопроса */
    startQuestion() {
        if (this.filteredQuestions.length === 0) return;
        this.currentQuestionIndex = 0;
        const question = this.filteredQuestions[this.currentQuestionIndex];
        this.quizSocket.startQuestion(this.gameId, question._id);
    }

    /** Преподаватель показывает правильный ответ */
    showAnswer() {
        this.quizSocket.showAnswer(this.gameId);
    }

    /** Переход к следующему вопросу */
    nextQuestion() {
        if (this.currentQuestionIndex < this.filteredQuestions.length - 1) {
        this.currentQuestionIndex++;
        const question = this.filteredQuestions[this.currentQuestionIndex];
        this.quizSocket.nextQuestion(this.gameId, question._id);
        } else {
        alert("Это был последний вопрос.");
        }
    }

    /** Завершение игры */
    endGame() {
        this.quizSocket.endGame(this.gameId);
    }

    /** Студент выбирает ответ */
    chooseAnswer(opt: string) {
        if (!this.currentQuestion) return;
        this.quizSocket.sendStudentAnswer(this.gameId, this.user.fullName, [opt]);
        this.answersReceived.push(this.user.fullName);
    }
}
