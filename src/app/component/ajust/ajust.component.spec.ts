import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjustComponent } from './ajust.component';

describe('AjustComponent', () => {
  let component: AjustComponent;
  let fixture: ComponentFixture<AjustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjustComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
