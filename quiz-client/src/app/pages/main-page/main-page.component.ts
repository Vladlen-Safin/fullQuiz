import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interface/user';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  
  user: any;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { 
    this.authService.currentUser$.subscribe((user: IUser | null) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout();
  }

  moveToCreateQuiz() {
    this.router.navigate(['/create-quiz']);
  }

  moveToAdminPanel() {
    this.router.navigate(['/admin']);
  }
}
