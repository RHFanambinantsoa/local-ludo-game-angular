import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChoosePlayersModalComponent } from '../../components/choose-players-modal/choose-players-modal.component';
import { AnimatedTextComponent } from '../../components/animated-text-component/animated-text.component';
import { PlayerZoneComponent } from '../../components/player-zone-component/player-zone.component';
import { PLAYER_COLOR } from '../../enums/PlayerColor.enum';
import { DiceComponent } from '../../components/dice-component/dice.component';
import { PawnComponent } from '../../components/pawn-component/pawn.component';
import { IPawn } from '../../interfaces/IPawn';
import { CASE_TYPE } from '../../enums/CaseType.enum';
import { ActivatedRoute } from '@angular/router';
import { IPlayer } from '../../interfaces/IPlayer';
import { ICase } from '../../interfaces/ICase';
import { IGame } from '../../interfaces/IGame';
import { COURSES } from '../../constants/gameConst';

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
  turn!: PLAYER_COLOR;

  nbPlayers: number = 0;
  pawns: IPawn[] = [];
  playedColors: PLAYER_COLOR[] = [];

  game!: IGame;

  isResumable: boolean = false;
  pawnsPlaced: boolean = false;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    //verifie si il n'y a pas de partie inachevée dans le localStorage
    const storedPawns = localStorage.getItem('game');
    if (storedPawns) {
      this.isResumable = true;
      this.game = JSON.parse(storedPawns);
      this.pawns = this.generatePawnsList(this.game.players);
      this.playedColors = this.generateColorList(this.game.players);
      this.turn = this.game.turn;
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
      this.pawns = this.generatePawnsList(this.game.players);
      this.playedColors = this.generateColorList(this.game.players);
      this.turn = this.game.turn;
      this.saveChanges(this.game);
    }
  }

  ngAfterViewInit() {}

  generateColorList(players: IPlayer[]) {
    let colorList: PLAYER_COLOR[] = [];
    players.forEach((player) => {
      colorList.push(player.color);
    });
    return colorList;
  }

  generatePawnsList(players: IPlayer[]) {
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
          });
        }
        pawnsList.push(...player.pawns);
      } else {
        pawnsList.push(...player.pawns);
      }
    });
    return pawnsList;
  }

  generatePlayers(nbPlayers: number) {
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

  saveChanges(game: IGame) {
    this.stopAllPawnMovement();
    localStorage.setItem('game', JSON.stringify(game));
  }

  private findConstantCases(caseToFind: String, color: PLAYER_COLOR) {
    let course = COURSES.filter((cours) => cours.color === color)[0];
    let position =
      caseToFind === 'start' ? course.startCommonCase : course.endCommonCase;
    return { type: CASE_TYPE.COMMON, position: position };
  }

  isTurn(color: PLAYER_COLOR) {
    return this.turn != color ? false : true;
  }

  nextPlayer() {
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
    this.saveChanges(this.game);
  }

  onDiceClicked(event: boolean, playerColor: PLAYER_COLOR) {
    if (!event) return;
    this.diceValue = this.rollDice();
    let pawnsMoveable: IPawn[] = [];
    //jerene hoe aiza avy ny pion de couleur player color ny current color

    //raha misy efa tafavoaka d atao moveable izay tafavoaka izany hoe position>0

    //raha dicevalue==6 miampy an'le eo ambony d atao moveable koa ilay ao anaty home izany hoe na position -1 ary
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
    // if (pawnsMoveable) pawnsMoveable[0].isMoveable = true;
    console.log(pawnsMoveable);
    if (pawnsMoveable) {
      pawnsMoveable.forEach((p) => {
        p.isMoveable = true;
        if (p.id == 'BLUEpiece0') {
          p.currentCase = { type: CASE_TYPE.COMMON, position: 29 };
          this.placePawn(
            p.id,
            p.color,
            p.currentCase.type,
            p.currentCase.position,
          );
        }
        // this.updatePawn(p);
        console.log(this.game);
      });
    }

    //mbola afaka mandeha izany hoe tsy tonga d next tours
    // avy manova ilay tableau testena raha mety hoe tonga d miova ve ilay izy raha moveable ovaina
    console.log(this.diceValue, playerColor);

    //eto ny logique an'ilay mandeha
    console.log('manaonao zavatra kely eto');
    setTimeout(() => {
      this.nextPlayer();
      if (this.diceValue != 6) {
      }
    }, 2000);
  }

  rollDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  stopAllPawnMovement() {
    this.game.players.forEach((player) => {
      player.pawns.forEach((pa) => {
        pa.isMoveable = false;
        pa.isMoving = false;
      });
    });
  }

  // testTurnToMoveable() {
  //   this.pawn.isMoving = false;
  //   this.pawn.isMoveable = true;
  // }

  // move() {
  //   this.pawn.isMoveable = false;
  //   this.pawn.isMoving = true;
  // }

  onPawnClick(pawn: IPawn) {
    console.log('test', pawn);
  }

  findPawnById(id: string) {
    let pawns;
  }

  updatePawn(pawn: IPawn) {
    this.game.players.forEach((player) => {
      if (player.id == pawn.idPlayer) {
        player.pawns.forEach((pa) => {
          if (pa.id == pawn.id) {
            pa = pawn;
          }
        });
      }
    });
  }

  async onGoBackHome(pawn: IPawn) {
    pawn.previewsCase = pawn.currentCase;
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
    pawn.currentCase = { type: CASE_TYPE.COMMON, position: -1 };
  }

  async placePawn(
    pawnId: string,
    pawnColor: PLAYER_COLOR,
    caseType: CASE_TYPE | undefined,
    position: number | undefined,
  ) {
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

  async placeAllPawns(pawns: IPawn[]) {
    await pawns.forEach((pw) => {
      this.placePawn(
        pw.id,
        pw.color,
        pw.currentCase?.type,
        pw.currentCase?.position,
      );
    });
    this.pawnsPlaced = true;
  }

  isPlayedColor(color: PLAYER_COLOR) {
    return this.playedColors.filter((c) => c == color)[0] ? true : false;
  }
}
