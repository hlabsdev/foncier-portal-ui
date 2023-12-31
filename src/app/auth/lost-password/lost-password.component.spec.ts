import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LostPasswordComponent} from './lost-password.component';

describe('LoginComponent', () => {
  let component: LostPasswordComponent;
  let fixture: ComponentFixture<LostPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LostPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LostPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
