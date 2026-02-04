import { Component, inject, model } from '@angular/core';
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

@Component({
  selector: 'app-choose-players-modal',
  imports: [
    MatRadioModule,
    FormsModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './choose-players-modal.component.html',
  styleUrl: './choose-players-modal.component.scss',
})
export class ChoosePlayersModalComponent {
  readonly dialogRef = inject(MatDialogRef<ChoosePlayersModalComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly players = model(this.data.players);

  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close();
  }
}
