import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersGlobalComponent } from './users-global.component';

describe('UsersGlobalComponent', () => {
  let component: UsersGlobalComponent;
  let fixture: ComponentFixture<UsersGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersGlobalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
