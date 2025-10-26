import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { WindowEnvHelper } from "src/app/helpers/window-env.helper";
import { IQuestion } from "src/app/interface/question";

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    
    private apiUrl = WindowEnvHelper.getValue<string>('apiUrl');

    constructor(
        private http: HttpClient
    ) {}

    /** Функция для добавления вопросов */
    addQuestion(data: any): Observable<IQuestion> {
        return this.http.post<IQuestion>(`${this.apiUrl}/question/create`, data);
    }

    /** Функция получения всех вопросов */
    allQuestion(): Observable<IQuestion[]> {
        return this.http.get<IQuestion[]>(`${this.apiUrl}/question/all`);
    }

    /** Функция обновления вопроса по id */
    updateQuestion(data: any, questionId: string): Observable<IQuestion> {
        return this.http.put<IQuestion>(`${this.apiUrl}/question/${questionId}`, data);
    }

    /** Функция удаления вопроса по id */
    deleteQuestion(questionId: string)  {
        return this.http.delete(`${this.apiUrl}/question/${questionId}`);
    }

    /** Функция получения вопроса по id */
    getQuestion(questionId: string): Observable<IQuestion> {
        return this.http.get<IQuestion>(`${this.apiUrl}/question/${questionId}`);
    }

}