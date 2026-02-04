import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseOptionsModalComponent } from './choose-options-modal.component';

describe('ChooseOptionsModalComponent', () => {
  let component: ChooseOptionsModalComponent;
  let fixture: ComponentFixture<ChooseOptionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseOptionsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
