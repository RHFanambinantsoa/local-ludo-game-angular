import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { COMMON_CASE_NUMBER, COURSES } from '../../constants/gameConst';
import { ICaseStyling } from '../../interfaces/ICaseStyling';
import { PLAYER_COLOR } from '../../enums/PlayerColor.enum';
import { NgFor, NgClass, NgIf, NgStyle } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-player-zone',
  imports: [NgFor, NgClass, NgStyle, MatIcon, NgIf],
  templateUrl: './player-zone.component.html',
  styleUrl: './player-zone.component.scss',
})
export class PlayerZoneComponent {
  @Input() position: number = 0;
  @Input() blink: boolean = false;
  @Input() color!: PLAYER_COLOR; //!: Marque comme potentiellement undefined

  startCase = 0;
  cells: ICaseStyling[] = [];
  homePointsId: String[] = [];
  styleObject: any = {};

  ngOnInit() {
    //ato amin'ny init vao tokony hampiasa ilay input
    this.startCase = this.findStartCase();
    this.cells = this.generateCasesByColor(
      this.color as PLAYER_COLOR,
      this.startCase,
    );
    this.homePointsId = this.generateHomePointId();
    this.styleObject = this.changeColor();
  }

  findStartCase() {
    let course = COURSES.filter(
      (course) => course.color === (this.color as PLAYER_COLOR),
    );
    return course[0]?.startCommonCase;
  }

  generateHomePointId() {
    let homePoints: string[] = [];
    for (let i = 0; i < 4; i++) {
      let id = this.color + 'home' + i;
      homePoints.push(id);
    }
    return homePoints;
  }

  changeColor() {
    let style = { backgroundStyle: {}, colorStyle: {}, borderStyle: {} };
    switch (this.color) {
      case PLAYER_COLOR.RED:
        style.backgroundStyle = {
          backgroundColor: 'red',
          border: '1px solid rgb(109 4 12)',
        };
        style.colorStyle = { color: 'red' };
        style.borderStyle = { border: '1px solid rgb(109 4 12)' };
        break;
      case PLAYER_COLOR.BLUE:
        style.backgroundStyle = {
          backgroundColor: 'blue',
          border: '1px solid rgb(13 4 59)',
        };
        style.colorStyle = { color: 'blue' };
        style.borderStyle = { border: '1px solid rgb(13 4 59)' };
        break;
      case PLAYER_COLOR.YELLOW:
        style.backgroundStyle = {
          backgroundColor: 'yellow',
          border: '1px solid rgb(105 98 3)',
        };
        style.colorStyle = { color: 'yellow' };
        style.borderStyle = { border: '1px solid rgb(105 98 3)' };
        break;
      case PLAYER_COLOR.GREEN:
        style.backgroundStyle = {
          backgroundColor: 'green',
          border: '1px solid rgb(8 57 3)',
        };
        style.colorStyle = { color: 'green' };
        style.borderStyle = { border: '1px solid rgb(8 57 3)' };
        break;
      default:
        break;
    }
    return style;
  }

  generateCasesByColor(color: PLAYER_COLOR, startCase: number) {
    let cells: ICaseStyling[] = [];
    for (let i = 6; i > 0; i--) {
      let firstColumn = startCase + i - 2;
      let thirdColumn =
        firstColumn > 6
          ? firstColumn - i * 2
          : COMMON_CASE_NUMBER + firstColumn - i * 2;
      cells.push({
        id:
          firstColumn > 0
            ? 'C' + firstColumn
            : 'C' + (firstColumn + COMMON_CASE_NUMBER),
        colored: firstColumn == startCase,
      });
      cells.push({
        id:
          i > 1
            ? color + (i - 1)
            : firstColumn != 0
              ? 'C' + (firstColumn - 1)
              : 'C' + (firstColumn + COMMON_CASE_NUMBER - 1),
        colored: i > 1,
        enterCase: i == 1,
      });
      cells.push({
        id: 'C' + thirdColumn,
        colored: false,
        isSafeCase:
          startCase != 1
            ? thirdColumn == startCase - 5
            : thirdColumn == COMMON_CASE_NUMBER + startCase - 5,
      });
    }
    return cells;
  }

  getTransformStyle() {
    const transforms = [
      'rotate(90deg) translate(0%, -100%)',
      'rotate(180deg) translate(-100%, -100%)',
      'rotate(-90deg) translate(-100%, 0%)',
    ];
    return transforms[this.position] ?? null;
  }
}
