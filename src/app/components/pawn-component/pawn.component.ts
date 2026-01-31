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
import { IPawn } from '../../interfaces/IPawn';

@Component({
  selector: 'app-pawn',
  imports: [NgIf, NgClass, MatIcon],
  templateUrl: './pawn.component.html',
  styleUrl: './pawn.component.scss',
})
export class PawnComponent {
  @Input() pawn!: IPawn;

  @Output() pawnClicked = new EventEmitter<IPawn>();

  pawnRolled: boolean = false;

  PLAYER_COLOR = PLAYER_COLOR;

  ngOnInit() {}

  emitClick() {
    this.pawnClicked.emit(this.pawn);
  }
}
