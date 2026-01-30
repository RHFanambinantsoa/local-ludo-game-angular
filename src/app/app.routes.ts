import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GameBoardComponent } from './pages/game-board/game-board.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'gameBoard', component: GameBoardComponent },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
