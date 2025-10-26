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
    selectedAnswer: string | null = null;

    // Таймер
    timer: number = 90; // 1 мин 30 сек
    timerInterval: any;
    showTimer: boolean = false;
    isAnsweringBlocked: boolean = false;
    timerProgress: number = 100; // процент заполнения круга (100% = полный)

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

        // получаем имя из query параметров
        this.route.queryParamMap.subscribe(params => {
            const nameFromParams = params.get('name');
            if (nameFromParams) {
            this.user.fullName = nameFromParams;
            localStorage.setItem("user", JSON.stringify(this.user)); // сохраняем для использования
            this.quizSocket.joinGame(this.gameId, nameFromParams);
            }

            // если преподаватель — загружаем вопросы
            if (this.isTeacher) {
            this.groupGameId = params.get('groupGameId')!;
            console.log('Получен groupGameId:', this.groupGameId);
            this.loadQuestions();
            }
        });
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

        // запускаем таймер
        // this.startTimer();
    }

    startTimer() {
        this.showTimer = true;
        this.timer = 90; // 1 минута 30 секунд
        this.timerProgress = 100;
        this.isAnsweringBlocked = false;

        clearInterval(this.timerInterval);

        const totalTime = 90;
        this.timerInterval = setInterval(() => {
            this.timer--;
            this.timerProgress = (this.timer / totalTime) * 100;

            // Когда время истекло — блокируем ответы
            if (this.timer <= 0) {
            clearInterval(this.timerInterval);
            this.isAnsweringBlocked = true;

            // Через 10 секунд показываем ответ
            setTimeout(() => {
                this.showAnswer();

                // Через ещё 20 секунд — следующий вопрос
                setTimeout(() => {
                this.nextQuestion();
                }, 20000);
            }, 10000);
            }
        }, 1000);
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
        if (!this.currentQuestion || this.isAnsweringBlocked) return;
        this.selectedAnswer = opt;
        this.quizSocket.sendStudentAnswer(this.gameId, this.user.fullName, [opt]);
        this.answersReceived.push(this.user.fullName);
    }
}
