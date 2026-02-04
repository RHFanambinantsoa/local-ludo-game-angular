import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePlayersModalComponent } from './choose-players-modal.component';

describe('ChoosePlayersModalComponent', () => {
  let component: ChoosePlayersModalComponent;
  let fixture: ComponentFixture<ChoosePlayersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoosePlayersModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoosePlayersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
