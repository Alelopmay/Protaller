import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistreCarComponent } from './registre-car.component';

describe('RegistreCarComponent', () => {
  let component: RegistreCarComponent;
  let fixture: ComponentFixture<RegistreCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistreCarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistreCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
