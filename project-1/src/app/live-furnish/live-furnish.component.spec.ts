import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveFurnishComponent } from './live-furnish.component';

describe('LiveFurnishComponent', () => {
  let component: LiveFurnishComponent;
  let fixture: ComponentFixture<LiveFurnishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveFurnishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveFurnishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
