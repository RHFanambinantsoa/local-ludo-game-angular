import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-choose-options-modal',
  imports: [
    MatRadioModule,
    FormsModule,
    MatDialogContent,
    MatDialogActions,
    MatIcon,
  ],
  templateUrl: './choose-options-modal.component.html',
  styleUrl: './choose-options-modal.component.scss',
})
export class ChooseOptionsModalComponent {
  nbPlayers: number = 4;
  scoreTarget: number = 4;

  constructor(
    private dialogRef: MatDialogRef<ChooseOptionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close({
      nbPlayers: this.nbPlayers,
      scoreTarget: this.scoreTarget,
    });
  }
}
