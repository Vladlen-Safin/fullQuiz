import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WindowEnvHelper } from 'src/app/helpers/window-env.helper';
import { IGroupGame } from 'src/app/interface/groupGame';

@Injectable({
    providedIn: 'root'
})
export class GroupGameService {

    private apiUrl = WindowEnvHelper.getValue<string>('apiUrl');

    constructor(
        private http: HttpClient
    ) { }

    /** Функция создания вида игры */
    createGroupGame(data: any): Observable<IGroupGame> {
        return this.http.post<IGroupGame>(`${this.apiUrl}/groupgame/`, data);
    }

    /** Функция получения всех видов игр */
    getAllGroupGame():Observable<IGroupGame[]> {
        return this.http.get<IGroupGame[]>(`${this.apiUrl}/groupgame/`);
    }

    /** Функция изменения вида игры по id */
    updateGroupGame(groupGameId: string, data: any): Observable<IGroupGame> {
        return this.http.put<IGroupGame>(`${this.apiUrl}/groupgame/${groupGameId}`, data);
    }

    /** Функция получения определенного вида по id */
    getGroupGame(groupGameId: string): Observable<IGroupGame> {
        return this.http.get<IGroupGame>(`${this.apiUrl}/groupgame/${groupGameId}`);
    }

    /** Функция удаления вида игры по id */
    deleteGroupGame(groupGameId: string) {
        return this.http.delete(`${this.apiUrl}/groupgame/${groupGameId}`)
    }
}
