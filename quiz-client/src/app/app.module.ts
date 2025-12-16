import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './pages/login/login.module';
import { RegisterModule } from './pages/register/register.module';
import { MainPageModule } from './pages/main-page/main-page.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { CreateGameModule } from './components/create-game/create-game.module';
import { JoinGameModule } from './components/join-game/join-game.module';
import { LobbyModule } from './components/lobby/lobby.module';
import { AdminModule } from './pages/admin/admin.module';
import { TeacherModule } from './components/teacher/teacher.module';
import { StudentModule } from './components/student/student.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LoginModule,
    RegisterModule,
    MainPageModule,
    CreateGameModule,
    JoinGameModule,
    LobbyModule,
    AdminModule,
    TeacherModule,
    StudentModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
