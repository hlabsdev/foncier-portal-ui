import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ZonesStatsComponent} from './zones-stats.component';

describe('ZonesStatsComponent', () => {
  let component: ZonesStatsComponent;
  let fixture: ComponentFixture<ZonesStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZonesStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonesStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
