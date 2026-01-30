import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { COMMON_CASE_NUMBER, COURSES } from '../../constants/gameConst';
import { ICaseStyling } from '../../interfaces/ICaseStyling';
import { PLAYER_COLOR } from '../../enums/PlayerColor.enum';
import { NgFor, NgClass, NgIf, NgStyle } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dice',
  imports: [NgIf, NgClass],
  templateUrl: './dice.component.html',
  styleUrl: './dice.component.scss',
})
export class DiceComponent {
  @Input() leftSide: boolean = false;
  @Input() diceValue: number = 1;
  @Input() clickable: boolean = false;

  diceRolled: boolean = false;
  ngOnInit() {}

  rollDice() {
    this.diceRolled = true;
    this.diceValue = this.testLancerDe();
    setTimeout(() => {
      this.diceRolled = false;
    }, 500);
    console.log(this.diceValue);
  }

  testLancerDe() {
    return Math.floor(Math.random() * 6) + 1;
  }
}
