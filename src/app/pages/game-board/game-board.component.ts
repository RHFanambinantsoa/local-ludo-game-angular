import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PlayerZoneComponent } from '../../components/player-zone-component/player-zone.component';
import { PLAYER_COLOR } from '../../enums/PlayerColor.enum';
import { DiceComponent } from '../../components/dice-component/dice.component';
import { PawnComponent } from '../../components/pawn-component/pawn.component';
import { IPawn } from '../../interfaces/IPawn';
import { CASE_TYPE } from '../../enums/CaseType.enum';
import { ActivatedRoute } from '@angular/router';
import { IPlayer } from '../../interfaces/IPlayer';
import { IGame } from '../../interfaces/IGame';
import { COURSES, SAFE_CASES } from '../../constants/gameConst';
import { IDice } from '../../interfaces/IDice';
import { ICase } from '../../interfaces/ICase';

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

  game!: IGame;
  diceValue: number = 1;
  diceClickable: boolean = true;
  turn!: PLAYER_COLOR;
  turnReapet: { turn?: PLAYER_COLOR; reapet?: number } = {};

  nbPlayers: number = 0;
  pawns: IPawn[] = [];
  playedColors: PLAYER_COLOR[] = [];

  isResumable: boolean = false;
  pawnsPlaced: boolean = false;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    //verifie si il n'y a pas de partie inachevée dans le localStorage
    const storedPawns = localStorage.getItem('game');
    if (storedPawns) {
      this.isResumable = true;
      this.game = JSON.parse(storedPawns);
    } else {
      // créer un tableau de pions d'après le nombre de joueurs reçu
      //recupérer le nombre de joueurs
      this.route.queryParams.subscribe((params) => {
        this.nbPlayers = Number(params['players']);
      });
      this.game = {
        id: `LudoGame${this.nbPlayers}Joueurs`,
        players: this.generatePlayers(this.nbPlayers),
        target: 4,
        turn: PLAYER_COLOR.GREEN,
      };
    }
    this.pawns = this.generatePawnsList(this.game.players);
    this.playedColors = this.generateColorList(this.game.players);
    this.turn = this.game.turn;
    this.saveChanges(this.game);
  }

  ngAfterViewInit() {}

  onDiceClicked(event: boolean, playerColor: PLAYER_COLOR) {
    if (!event) return;
    if (this.turnReapet && this.turnReapet.turn != this.turn) {
      this.turnReapet = {};
    }
    this.diceClickable = false;
    this.diceValue = this.rollDice();
    let pawnsMoveable: IPawn[] = [];
    let notMoveable = this.pawns.filter(
      (p) =>
        p.color == playerColor &&
        p.currentCase?.type == CASE_TYPE.PERSONAL &&
        6 - p.nbPersonalCaseParcouru < this.diceValue,
    );
    if (this.diceValue == 6) {
      pawnsMoveable = this.pawns.filter(
        (p) => p.color == playerColor && p.hasArrived == false,
      );
    } else {
      pawnsMoveable = this.pawns.filter(
        (pw) =>
          pw.color == playerColor &&
          pw.currentCase?.position &&
          pw.currentCase?.position > 0 &&
          pw.hasArrived == false,
      );
    }
    if (pawnsMoveable.length > 0) {
      pawnsMoveable.forEach((p) => {
        p.isMoveable = true;
      });
      if (notMoveable.length > 0) {
        notMoveable.forEach((p) => {
          p.isMoveable = false;
        });
      }
      if (notMoveable.length == 4) {
        //tsisy afaka ahetsika intsony ny pion anaky 4 izany
        setTimeout(() => {
          this.nextPlayer();
        }, 1000);
      }
    } else {
      setTimeout(() => {
        this.nextPlayer();
      }, 1000);
    }
  }

  onPawnClick(pawn: IPawn) {
    if (pawn.currentCase?.position && pawn.currentCase?.position < 0) {
      this.setStartCase(pawn);
    } else {
      this.updatePawn(pawn, this.diceValue);
      if (pawn.currentCase?.id) {
        const otherOccupant = this.findOtherCaseOccupant(
          this.pawns,
          pawn.currentCase?.id,
          pawn.color,
        );
        if (otherOccupant) {
          otherOccupant.forEach((pa) => {
            this.goBackHome(pa);
          });
        }
        console.log('ocupant', otherOccupant);
      }
    }
    if (this.diceValue == 6) {
      this.onMoreTurn();
    } else {
      this.nextPlayer();
    }
  }

  updatePawn(pawn: IPawn, diceValue: number) {
    let positionFrom0 = pawn.nbPersonalCaseParcouru
      ? pawn.nbPersonalCaseParcouru + diceValue
      : pawn.nbCommunCaseParcouru + diceValue;

    if (positionFrom0 > 50) {
      pawn.nbPersonalCaseParcouru = positionFrom0 % 50;
      pawn.nbCommunCaseParcouru = 50;
    } else {
      if (pawn.nbPersonalCaseParcouru) {
        pawn.nbPersonalCaseParcouru =
          positionFrom0 < 7 ? positionFrom0 : pawn.nbPersonalCaseParcouru;
      } else {
        pawn.nbCommunCaseParcouru = positionFrom0;
      }
    }
    if (!pawn.nbPersonalCaseParcouru) {
      pawn.previewsCase = pawn.currentCase;
      const casePosition = pawn.nbCommunCaseParcouru + pawn.startCase.position;
      pawn.currentCase = {
        type: CASE_TYPE.COMMON,
        position: casePosition < 53 ? casePosition : casePosition % 52,
      };
    } else {
      pawn.previewsCase = pawn.currentCase;
      pawn.currentCase = {
        type: CASE_TYPE.PERSONAL,
        position: pawn.nbPersonalCaseParcouru,
      };

      if (pawn.nbPersonalCaseParcouru == 6) pawn.hasArrived = true;
    }

    this.placePawn(pawn, pawn.currentCase?.type, pawn.currentCase?.position);
  }

  async placeAllPawns(pawns: IPawn[]) {
    await pawns.forEach((pw) => {
      this.placePawn(pw, pw.currentCase?.type, pw.currentCase?.position);
    });
    this.pawnsPlaced = true;
  }

  findOtherCaseOccupant(
    pawns: IPawn[],
    targetCaseId: string,
    color: PLAYER_COLOR,
  ) {
    return pawns.filter(
      (p) => p.currentCase?.id == targetCaseId && p.color != color,
    );
  }

  isPlayedColor(color: PLAYER_COLOR) {
    return this.playedColors.filter((c) => c == color)[0] ? true : false;
  }

  isTurn(color: PLAYER_COLOR) {
    return this.turn != color ? false : true;
  }

  createDice(color: PLAYER_COLOR) {
    let dice: IDice = {
      isClickable: this.turn == color ? this.diceClickable : false,
      isLeftSide:
        color == PLAYER_COLOR.RED || color == PLAYER_COLOR.GREEN ? true : false,
      value: this.isTurn(color) ? this.diceValue : 0,
    };
    return dice;
  }

  // FUNCTIONS : MOUVEMENT ou EMPLACEMENT du PION dans le DOM ////////////////////////////

  //place le pion dans le plateau de jeu, dans une case spécifique
  private async placePawn(
    pawn: IPawn,
    caseType: CASE_TYPE | undefined,
    position: number | undefined,
  ) {
    let htmlPawnId = pawn.id;
    let htmlCaseId = '';
    if (position && position > 0) {
      htmlCaseId =
        caseType == CASE_TYPE.COMMON ? 'C' + position : pawn.color + position;
    } else {
      htmlCaseId = pawn.color + 'home' + pawn.id.slice(-1);
    }
    const casehtml = document.getElementById(htmlCaseId);
    const pawnhtml = document.getElementById(htmlPawnId);
    if (pawnhtml && casehtml) {
      const rectPawn = pawnhtml.getBoundingClientRect();
      const rectCase = casehtml.getBoundingClientRect();
      pawnhtml.style.top = rectCase.top - rectPawn.height / 2 + 'px';
      pawnhtml.style.left = rectCase.left + 'px';
    }
    if (pawn.currentCase) {
      pawn.currentCase.id = htmlCaseId;
      pawn.isSafe =
        pawn.currentCase.type == CASE_TYPE.COMMON &&
        pawn.currentCase.position > 0
          ? SAFE_CASES.includes(pawn.currentCase.position)
          : true;
    }
  }

  private async goBackHome(pawn: IPawn) {
    pawn.previewsCase = pawn.currentCase;
    await this.placePawn(
      pawn,
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
        await this.placePawn(pawn, CASE_TYPE.COMMON, current - 1);
        await new Promise((resolve) => setTimeout(resolve, 50));
        current--;
      }
      await this.placePawn(pawn, CASE_TYPE.COMMON, -1);
    }
    pawn.currentCase = { type: CASE_TYPE.COMMON, position: -1 };
  }

  private stopAllPawnMovement() {
    this.game.players.forEach((player) => {
      player.pawns.forEach((pa) => {
        pa.isMoveable = false;
        pa.isMoving = false;
      });
    });
  }

  private async setStartCase(pawn: IPawn) {
    pawn.previewsCase = pawn.currentCase;
    pawn.currentCase = pawn.startCase;
    await this.placePawn(
      pawn,
      pawn.currentCase?.type,
      pawn.currentCase?.position,
    );
    pawn.nbCommunCaseParcouru = 0;
    pawn.nbPersonalCaseParcouru = 0;
  }

  /////////////////////////////////////////////////////////////////

  /**
   * mitady ny case invariable pour chaque couleurs
   * ohatra hoe ny case ivoahany voalohany (startCase)
   * sy ny case commun hitsofohany ao amin'ny case personnelle-ny amzay (entryCase)
   * @param caseToFind : ex: "end" ou "start"
   * @param color
   * @returns ICase
   */
  private findConstantCases(caseToFind: String, color: PLAYER_COLOR) {
    let course = COURSES.filter((cours) => cours.color === color)[0];
    let position =
      caseToFind === 'start' ? course.startCommonCase : course.endCommonCase;
    return { id: 'C' + position, type: CASE_TYPE.COMMON, position: position };
  }

  private generateColorList(players: IPlayer[]) {
    let colorList: PLAYER_COLOR[] = [];
    players.forEach((player) => {
      colorList.push(player.color);
    });
    return colorList;
  }

  private generatePawnsList(players: IPlayer[]) {
    let pawnsList: IPawn[] = [];
    players.forEach((player) => {
      if (player.pawns.length == 0) {
        for (let i = 0; i < 4; i++) {
          player.pawns.push({
            id: `${player.color}piece${i}`,
            idPlayer: player.id,
            color: player.color,
            startCase: this.findConstantCases('start', player.color),
            entryCase: this.findConstantCases('entry', player.color),
            currentCase: { type: CASE_TYPE.COMMON, position: -1 },
            hasArrived: false,
            isSafe: true,
            isMoveable: false,
            isMoving: false,
            nbCommunCaseParcouru: 0,
            nbPersonalCaseParcouru: 0,
          });
        }
        pawnsList.push(...player.pawns);
      } else {
        pawnsList.push(...player.pawns);
      }
    });
    return pawnsList;
  }

  private generatePlayers(nbPlayers: number) {
    let players: IPlayer[] = [];
    let colors: PLAYER_COLOR[] = [
      PLAYER_COLOR.BLUE,
      PLAYER_COLOR.RED,
      PLAYER_COLOR.GREEN,
      PLAYER_COLOR.YELLOW,
    ];
    let usedColors: PLAYER_COLOR[] = [];
    if (nbPlayers === 2) {
      usedColors = [colors[0], colors[2]];
    } else if (nbPlayers === 3) {
      usedColors = [colors[0], colors[1], colors[2]];
    } else {
      usedColors = colors;
    }
    for (let i = 0; i < nbPlayers; i++) {
      players.push({ id: i, color: usedColors[i], pawns: [] });
    }
    return players;
  }

  private saveChanges(game: IGame) {
    this.stopAllPawnMovement();
    localStorage.setItem('game', JSON.stringify(game));
  }

  private nextPlayer() {
    const currentTurn = this.turn;
    const currentTurnIndex = this.playedColors.findIndex(
      (p) => p == currentTurn,
    );
    if (currentTurnIndex < this.playedColors.length - 1) {
      this.turn = this.playedColors[currentTurnIndex + 1];
    } else {
      this.turn = this.playedColors[0];
    }
    this.game.turn = this.turn;
    this.diceClickable = true;
    this.saveChanges(this.game);
  }

  private onMoreTurn() {
    if (
      this.turnReapet &&
      this.turnReapet.reapet &&
      this.turnReapet.reapet == 2
    ) {
      this.nextPlayer();
      return;
    }
    this.turnReapet = {
      turn: this.turn,
      reapet:
        this.turnReapet && this.turnReapet.reapet
          ? this.turnReapet.reapet + 1
          : 1,
    };
    this.diceClickable = true;
    this.game.turn = this.turn;
    this.saveChanges(this.game);
  }

  private rollDice() {
    // return Math.floor(Math.random() * 6) + 1;
    return 6;
  }
}
