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
import { ChooseOptionsModalComponent } from '../../components/choose-options-modal/choose-options-modal.component';
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
  options = {
    nbPlayers: 4,
    scoreTarget: 4,
  };

  constructor(private router: Router) {}

  ngOnInit() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ChooseOptionsModalComponent, {
      autoFocus: true,
      restoreFocus: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.options = result;
        //naviguer vers gameboard en ajoutant le parametre nbplayers et scoreTarget
        this.router.navigate(['/gameboard'], {
          queryParams: {
            nbPlayers: this.options.nbPlayers,
            scoreTarget: this.options.scoreTarget,
          },
        });
      }
    });
  }
}
