import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { AuthGuard } from './guards/auth.guard';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { JoinGameComponent } from './components/join-game/join-game.component';
import { AdminComponent } from './pages/admin/admin.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: MainPageComponent, canActivate: [AuthGuard]},
  {path: 'create-quiz', component: CreateGameComponent, canActivate: [AuthGuard]},
  {path: 'join-game', component: JoinGameComponent},
  {path: 'lobby/:id', component: LobbyComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
