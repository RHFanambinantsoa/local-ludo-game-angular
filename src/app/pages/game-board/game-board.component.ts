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
import { CASE_TYPE } from '../../enums/CaseType.enum';
import { CdkObserveContent } from '@angular/cdk/observers';

@Component({
  selector: 'app-game-board',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    PlayerZoneComponent,
    DiceComponent,
    PawnComponent,
    CdkObserveContent,
  ],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent {
  PLAYER_COLOR = PLAYER_COLOR;
  celebrate: boolean = false;

  diceValue = 1;
  turn: number = 0;

  pawn: IPawn = {
    id: '',
    color: PLAYER_COLOR.BLUE,
    startCase: { type: CASE_TYPE.COMMON, position: 27 },
  };

  ngOnInit() {
    this.pawn = {
      id: 'BLUEpiece1',
      idPlayer: 0,
      color: PLAYER_COLOR.BLUE,
      isMoveable: false,
      isMoving: false,
      currentCase: { type: CASE_TYPE.COMMON, position: 45 },
      startCase: { type: CASE_TYPE.COMMON, position: 27 },
      entryCase: { type: CASE_TYPE.COMMON, position: 25 },
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

  async onGoBackHome(pawn: IPawn) {
    await this.placePawn(
      pawn.id,
      pawn.color,
      pawn.currentCase?.type,
      pawn.currentCase?.position,
    );
    await new Promise((resolve) => setTimeout(resolve, 50));
    let current = pawn.currentCase?.position;
    let startCase = pawn.startCase?.position;
    if (current && current > 0 && startCase > 0) {
      while (current != startCase) {
        if (current == 1) {
          current = 53;
        }
        await this.placePawn(
          pawn.id,
          pawn.color,
          CASE_TYPE.COMMON,
          current - 1,
        );
        await new Promise((resolve) => setTimeout(resolve, 50));
        current--;
      }
      await this.placePawn(pawn.id, pawn.color, CASE_TYPE.COMMON, -1);
    }
  }

  async placePawn(
    pawnId: string,
    pawnColor: PLAYER_COLOR,
    caseType: CASE_TYPE | undefined,
    position: number | undefined,
  ) {
    console.log('ato', pawnId, pawnColor, caseType, position);

    let htmlPawnId = pawnId;
    let place = document.getElementById(pawnColor + 'home' + pawnId);
    if (position && position > 0) {
      place =
        caseType == CASE_TYPE.COMMON
          ? document.getElementById('C' + position)
          : document.getElementById(pawnColor + position);
    } else {
      place = document.getElementById(pawnColor + 'home' + pawnId.slice(-1));
    }
    const pawn = document.getElementById(htmlPawnId);
    if (pawn && place) {
      const rectPawn = pawn.getBoundingClientRect();
      const rectCase = place.getBoundingClientRect();
      pawn.style.top = rectCase.top - rectPawn.height / 2 + 'px';
      pawn.style.left = rectCase.left + 'px';
    }
  }

  async setStartCase(pawn: IPawn) {
    await this.placePawn(
      pawn.id,
      pawn.color,
      pawn.startCase?.type,
      pawn.startCase?.position,
    );
    pawn.currentCase = pawn.startCase;
  }
}
