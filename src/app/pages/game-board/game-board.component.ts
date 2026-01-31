import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { AssetsUrls } from '../../constants/AssetsUrl';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ChoosePlayersModalComponent } from '../../components/choose-players-modal/choose-players-modal.component';
import { AnimatedTextComponent } from '../../components/animated-text-component/animated-text.component';
import { PlayerZoneComponent } from '../../components/player-zone-component/player-zone.component';
import { PLAYER_COLOR } from '../../enums/PlayerColor.enum';
import { DiceComponent } from '../../components/dice-component/dice.component';
import { PawnComponent } from '../../components/pawn-component/pawn.component';
import { IPawn } from '../../interfaces/IPawn';

@Component({
  selector: 'app-game-board',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    PlayerZoneComponent,
    DiceComponent,
    PawnComponent,
  ],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent {
  PLAYER_COLOR = PLAYER_COLOR;
  celebrate: boolean = false;

  diceValue = 1;
  turn: number = 0;

  pawn: IPawn = {};

  ngOnInit() {
    this.pawn = {
      id: 'test',
      idPlayer: 0,
      color: PLAYER_COLOR.GREEN,
      isMoveable: false,
      isMoving: false,
    };
  }

  isTurn(position: number) {
    if (this.turn != position) return false;
    return true;
  }

  nextPlayer() {
    if (this.turn < 3) this.turn++;
    else this.turn = 0;
  }

  onDiceClicked(event: boolean) {
    if (!event) return;
    this.diceValue = this.rollDice();
    //eto ny logique an'ilay mandeha
    console.log('manaonao zavatra kely eto');
    setTimeout(() => {
      if (this.diceValue != 6) {
        this.nextPlayer();
      }
    }, 2000);
  }

  rollDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  testTurnToMoveable() {
    this.pawn.isMoving = false;
    this.pawn.isMoveable = true;
  }

  move() {
    this.pawn.isMoveable = false;
    this.pawn.isMoving = true;
  }

  onPawnClick(pawn: IPawn) {
    console.log('test', pawn);
  }
}
