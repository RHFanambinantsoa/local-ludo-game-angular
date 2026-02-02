import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { COMMON_CASE_NUMBER, COURSES } from '../../constants/gameConst';
import { ICaseStyling } from '../../interfaces/ICaseStyling';
import { PLAYER_COLOR } from '../../enums/PlayerColor.enum';
import { NgFor, NgClass, NgIf, NgStyle } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dice',
  imports: [NgIf, NgClass, MatIcon],
  templateUrl: './dice.component.html',
  styleUrl: './dice.component.scss',
})
export class DiceComponent {
  @Input() leftSide: boolean = false;
  @Input() diceOption: { value?: number; isClickable?: boolean } = {};

  @Output() diceClicked = new EventEmitter<boolean>();
  diceRolled: boolean = false;

  ngOnInit() {}

  rollDice() {
    this.diceRolled = true;
    setTimeout(() => {
      this.diceRolled = false;
    }, 300);
    this.diceClicked.emit(true);
  }
}
