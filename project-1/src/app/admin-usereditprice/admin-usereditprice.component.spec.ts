import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsereditpriceComponent } from './admin-usereditprice.component';

describe('AdminUsereditpriceComponent', () => {
  let component: AdminUsereditpriceComponent;
  let fixture: ComponentFixture<AdminUsereditpriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUsereditpriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsereditpriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
