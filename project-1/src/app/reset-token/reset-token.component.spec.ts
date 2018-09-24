import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetTokenComponent } from './reset-token.component';

describe('ResetTokenComponent', () => {
  let component: ResetTokenComponent;
  let fixture: ComponentFixture<ResetTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
