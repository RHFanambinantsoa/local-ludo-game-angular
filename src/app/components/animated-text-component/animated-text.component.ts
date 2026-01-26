import { Component, ElementRef, ViewChild } from '@angular/core';
import { TypingText } from '../../constants/TypingText';

@Component({
  selector: 'app-animated-text',
  imports: [],
  templateUrl: './animated-text.component.html',
  styleUrl: './animated-text.component.scss',
})
export class AnimatedTextComponent {
  @ViewChild('h3typingText') myDiv!: ElementRef<HTMLDivElement>;

  currentText = '';
  counter = 0;
  private intervalId: any;

  ngOnInit() {
    setTimeout(() => {
      this.animateText();
    }, 1000);
  }

  animateText() {
    this.typeText(TypingText.fullText, 150, () => {
      setTimeout(() => {
        this.deleteText(3, 150, () => {
          this.typeText(TypingText.replaceText, 150, () => {
            this.typeText(TypingText.additionalText, 100);
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
