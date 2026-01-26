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

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    AnimatedTextComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  AssetsUrls = AssetsUrls;

  readonly dialog = inject(MatDialog);
  readonly players = signal('');

  ngOnInit() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ChoosePlayersModalComponent, {
      data: { players: this.players },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.players.set(result);
        console.log('mihidy', this.players());
      }
    });
  }
}
