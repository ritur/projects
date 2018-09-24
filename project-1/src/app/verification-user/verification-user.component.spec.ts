import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationUserComponent } from './verification-user.component';

describe('VerificationUserComponent', () => {
  let component: VerificationUserComponent;
  let fixture: ComponentFixture<VerificationUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
