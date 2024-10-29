import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistreClienteComponent } from './registre-cliente.component';

describe('RegistreClienteComponent', () => {
  let component: RegistreClienteComponent;
  let fixture: ComponentFixture<RegistreClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistreClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistreClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
