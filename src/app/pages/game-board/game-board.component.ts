import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PlayerZoneComponent } from '../../components/player-zone-component/player-zone.component';
import { PLAYER_COLOR } from '../../enums/PlayerColor.enum';
import { DiceComponent } from '../../components/dice-component/dice.component';
import { PawnComponent } from '../../components/pawn-component/pawn.component';
import { IPawn } from '../../interfaces/IPawn';
import { CASE_TYPE } from '../../enums/CaseType.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { IPlayer } from '../../interfaces/IPlayer';
import { IGame } from '../../interfaces/IGame';
import { COURSES, SAFE_CASES } from '../../constants/gameConst';
import { IDice } from '../../interfaces/IDice';
import { ICase } from '../../interfaces/ICase';
import { MatDialog } from '@angular/material/dialog';
import { ChooseOptionsModalComponent } from '../../components/choose-options-modal/choose-options-modal.component';

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
  readonly dialog = inject(MatDialog);

  //for test
  testMode = false;
  testDice = 1;

  PLAYER_COLOR = PLAYER_COLOR;

  celebrate: boolean = false;

  game!: IGame;

  diceValue: number = 1;
  diceClickable: boolean = true;
  turn!: PLAYER_COLOR;
  turnReapet: { turn?: PLAYER_COLOR; reapet?: number } = {};

  pawns: IPawn[] = [];
  playedColors: PLAYER_COLOR[] = [];

  isResumable: boolean = false;
  pawnsPlaced: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  async ngOnInit() {
    //verifie si il n'y a pas de partie inachevée dans le localStorage
    const storedPawns = localStorage.getItem('game');
    if (storedPawns) {
      const gameId = JSON.parse(storedPawns).id;
      if (gameId) {
        this.isResumable = true;
        this.game = JSON.parse(storedPawns);
      }
    } else {
      // créer un tableau de pions d'après le nombre de joueurs reçu
      //recupérer le nombre de joueurs
      let scoreTarget: number = 0;
      let nbPlayers: number = 0;
      this.route.queryParams.subscribe((params) => {
        nbPlayers = Number(params['nbPlayers']);
        scoreTarget = Number(params['scoreTarget']);
      });
      this.game = {
        id: `LudoGame${nbPlayers}Joueurs`,
        players: this.generatePlayers(nbPlayers),
        scoreTarget: scoreTarget,
        turn: PLAYER_COLOR.GREEN,
      };
    }
    this.pawns = this.generatePawnsList(this.game.players);
    this.playedColors = this.generateColorList(this.game.players);
    this.turn = this.game.turn;
    this.saveChanges(this.game);
  }

  ngAfterViewInit() {}

  async startNewGame() {
    let options = {
      nbPlayers: 4,
      scoreTarget: 4,
    };
    const dialogRef = this.dialog.open(ChooseOptionsModalComponent, {
      autoFocus: true,
      restoreFocus: true,
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result !== undefined) {
        options = result;
        this.router.navigate([], {
          queryParams: {
            nbPlayers: options.nbPlayers,
            scoreTarget: options.scoreTarget,
          },
        });
        localStorage.removeItem('game');
        this.isResumable = false;
        this.pawnsPlaced = false;
        this.celebrate = false;
        this.game = {
          id: `LudoGame${options.nbPlayers}Joueurs`,
          players: this.generatePlayers(options.nbPlayers),
          scoreTarget: options.scoreTarget,
          turn: PLAYER_COLOR.GREEN,
        };
        this.pawns = this.generatePawnsList(this.game.players);
        this.playedColors = this.generateColorList(this.game.players);
        this.turn = this.game.turn;
        this.diceValue = 1;
        this.saveChanges(this.game);
      }
    });
  }

  onDiceClicked(event: boolean, playerColor: PLAYER_COLOR) {
    if (!event) return;
    if (this.turnReapet && this.turnReapet.turn != this.turn) {
      this.turnReapet = {};
    }
    this.diceClickable = false;
    this.diceValue = this.testMode ? this.testDice : this.rollDice();
    let notArrivedPawns: IPawn[] = [];
    let personalNotMoveablePawns = this.pawns.filter(
      (p) =>
        p.color == playerColor &&
        p.currentCase?.type == CASE_TYPE.PERSONAL &&
        6 - p.nbPersonalCaseParcouru < this.diceValue,
    );
    if (this.diceValue == 6) {
      notArrivedPawns = this.pawns.filter(
        (p) => p.color == playerColor && !p.hasArrived,
      );
    } else {
      notArrivedPawns = this.pawns.filter(
        (pw) =>
          pw.color == playerColor &&
          pw.currentCase?.position &&
          pw.currentCase?.position > 0 &&
          !pw.hasArrived,
      );
    }
    if (notArrivedPawns.length > 0) {
      notArrivedPawns.forEach((p) => {
        p.isMoveable = true;
      });
      if (personalNotMoveablePawns.length > 0) {
        personalNotMoveablePawns.forEach((p) => {
          p.isMoveable = false;
        });
      }
      const pawnsMoveable = this.pawns.filter(
        (pw) => pw.color == playerColor && pw.isMoveable,
      );
      if (pawnsMoveable.length == 0) {
        //tsisy afaka ahetsika intsony ny pion anaky 4 izany
        setTimeout(() => {
          this.nextPlayer();
        }, 1000);
      }
      this.autoMovePawn();
    } else {
      setTimeout(() => {
        this.nextPlayer();
      }, 1000);
    }
  }

  async onPawnClick(pawn: IPawn) {
    this.stopAllPawnMovement();
    pawn.isMoving = true;
    if (pawn.currentCase?.position && pawn.currentCase?.position < 0) {
      this.setStartCase(pawn);
    } else {
      this.updatePawn(pawn, this.diceValue);
      await this.move(pawn);
      this.celebrate = this.checkEndGame(pawn.color, this.game.scoreTarget);
      if (this.celebrate) {
        this.stopAllPawnMovement();
        this.resetVariables();
        this.saveChanges(this.game);
        return;
      }
      if (pawn.currentCase?.id) {
        const otherOccupant = this.findCaseOccupant(
          this.pawns,
          pawn.currentCase?.id,
          pawn.color,
          false,
        );
        if (otherOccupant) {
          otherOccupant.forEach(async (pa) => {
            if (!pa.isSafe) {
              await this.goBackHome(pa);
              this.saveChanges(this.game);
            }
          });
        }
      }
    }

    if (this.diceValue == 6 || pawn.hasArrived) {
      this.onMoreTurn();
    } else {
      this.nextPlayer();
    }
    pawn.isMoving = false;
  }

  async placeAllPawns(pawns: IPawn[]) {
    await pawns.forEach((pw) => {
      this.placePawn(pw, pw.currentCase?.type, pw.currentCase?.position);
    });
    this.pawnsPlaced = true;
  }

  resetVariables() {
    this.isResumable = false;
    this.game.id = '';
    this.playedColors = [];
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

  async move(pawn: IPawn) {
    await this.placePawn(
      pawn,
      pawn.previewsCase?.type,
      pawn.previewsCase?.position,
    );
    await new Promise((resolve) => setTimeout(resolve, 200));
    let from = pawn.previewsCase;
    let to = pawn.currentCase;
    if (from && to) {
      if (
        (from?.type == CASE_TYPE.COMMON && to?.type == CASE_TYPE.COMMON) ||
        (from?.type == CASE_TYPE.PERSONAL && to?.type == CASE_TYPE.PERSONAL)
      ) {
        let current = from.position;
        let toPosition = to.position;
        while (current != toPosition) {
          if (current == 53) {
            current = 0;
          }
          await this.placePawn(pawn, to.type, current + 1);
          await new Promise((resolve) => setTimeout(resolve, 400));
          current++;
        }
      } else {
        let current = from?.position;
        let toPosition = to?.position;
        while (current != pawn.entryCase?.position) {
          if (current == 53) {
            current = 0;
          }
          await this.placePawn(pawn, CASE_TYPE.COMMON, current + 1);
          await new Promise((resolve) => setTimeout(resolve, 400));
          current++;
        }
        current = 0;
        while (current != toPosition) {
          await this.placePawn(pawn, CASE_TYPE.PERSONAL, current + 1);
          await new Promise((resolve) => setTimeout(resolve, 400));
          current++;
        }
      }
    }
  }

  /**
   * deplace un pion automatiquement si il n'y a qu'un seul pion moveable
   * ou tous les pions moveable sont dans la même case
   */
  private autoMovePawn() {
    let pawnMoveable = this.pawns.filter((p) => p.isMoveable == true);
    if (pawnMoveable.length == 1) {
      setTimeout(() => {
        this.onPawnClick(pawnMoveable[0]);
      }, 200);
    } else {
      if (pawnMoveable[0].currentCase && pawnMoveable[0].currentCase.id) {
        const pawnsInSameCase = this.findCaseOccupant(
          pawnMoveable,
          pawnMoveable[0].currentCase.id,
          pawnMoveable[0].color,
          true,
        );

        if (pawnsInSameCase.length == pawnMoveable.length) {
          setTimeout(() => {
            this.onPawnClick(pawnMoveable[0]);
          }, 100);
        }
      }
    }
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

  private updatePawn(pawn: IPawn, diceValue: number) {
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

    // this.placePawn(pawn, pawn.currentCase?.type, pawn.currentCase?.position);
  }

  private findCaseOccupant(
    pawns: IPawn[],
    caseId: string,
    color: PLAYER_COLOR,
    sameColor: boolean,
  ) {
    return sameColor
      ? pawns.filter((p) => p.currentCase?.id == caseId && p.color == color)
      : pawns.filter((p) => p.currentCase?.id == caseId && p.color != color);
  }

  private checkEndGame(color: PLAYER_COLOR, scoreTarget: number) {
    let nbPawnIn = this.pawns.filter(
      (p) => p.color == color && p.hasArrived,
    ).length;
    return nbPawnIn == scoreTarget;
  }

  rollDice(value?: number) {
    return !value ? Math.floor(Math.random() * 6) + 1 : value;
  }
}
