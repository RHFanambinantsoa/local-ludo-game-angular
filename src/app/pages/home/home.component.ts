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

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ChoosePlayersModalComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  AssetsUrls = AssetsUrls;

  @ViewChild('typingText') myDiv!: ElementRef<HTMLDivElement>;

  fullText = 'Développé par Bao';
  replaceText = 'Harilanto';
  additionalText = " dans le but d'apprendre";
  currentText = '';
  counter = 0;
  private intervalId: any;
  readonly dialog = inject(MatDialog);
  readonly players = signal('');

  ngOnInit() {
    setTimeout(() => {
      this.animateText();
    }, 1000);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ChoosePlayersModalComponent, {
      data: { players: this.players },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.players.set(result);
        console.log('mihidy', this.players);
      }
    });
  }

  animateText() {
    this.typeText(this.fullText, 150, () => {
      setTimeout(() => {
        this.deleteText(3, 150, () => {
          this.typeText(this.replaceText, 150, () => {
            this.typeText(this.additionalText, 150);
          });
        });
      }, 1000);
    });
  }

  typeText(text: string, speed: number, callback?: () => void) {
    this.counter = 0;
    this.intervalId = setInterval(() => {
      if (this.counter < text.length) {
        this.currentText += text.charAt(this.counter);
        this.myDiv.nativeElement.textContent = this.currentText;
        this.counter++;
      } else {
        clearInterval(this.intervalId);
        if (callback) callback();
      }
    }, speed);
  }

  deleteText(count: number, speed: number, callback?: () => void) {
    this.counter = 0;
    this.intervalId = setInterval(() => {
      if (this.counter < count) {
        this.currentText = this.currentText.slice(0, -1); // Supprime le dernier caractère
        this.myDiv.nativeElement.textContent = this.currentText;
        this.counter++;
      } else {
        clearInterval(this.intervalId);
        if (callback) callback();
      }
    }, speed);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
