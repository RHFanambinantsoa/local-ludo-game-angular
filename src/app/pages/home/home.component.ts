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
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ChoosePlayersModalComponent, {
      autoFocus: true,
      restoreFocus: true,
      data: { players: this.players },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        console.log(result);

        this.players.set(result);
        //naviguer vers gameboard en ajoutant le parametre nbplayers
        this.router.navigate(['/gameboard'], {
          queryParams: { players: this.players() },
        });
      }
    });
  }
}
