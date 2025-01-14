import { Component, ElementRef, ViewChild } from '@angular/core';
import { AssetsUrls } from '../../constants/AssetsUrl';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
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

  ngOnInit() {
    setTimeout(() => {
      this.animateText();
    }, 1000);
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
