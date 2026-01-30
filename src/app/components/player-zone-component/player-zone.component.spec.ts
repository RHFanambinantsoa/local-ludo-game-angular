import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerZoneComponent } from './player-zone.component';

describe('PlayerZoneComponent', () => {
  let component: PlayerZoneComponent;
  let fixture: ComponentFixture<PlayerZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerZoneComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(PlayerZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
