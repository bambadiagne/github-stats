import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSenegalComponent } from './users-senegal.component';

describe('UsersSenegalComponent', () => {
  let component: UsersSenegalComponent;
  let fixture: ComponentFixture<UsersSenegalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersSenegalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersSenegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
