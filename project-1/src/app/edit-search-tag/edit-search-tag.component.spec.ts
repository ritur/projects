import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSearchTagComponent } from './edit-search-tag.component';

describe('EditSearchTagComponent', () => {
  let component: EditSearchTagComponent;
  let fixture: ComponentFixture<EditSearchTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSearchTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSearchTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
