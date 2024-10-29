import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistreWorkerComponent } from './registre-worker.component';

describe('RegistreWorkerComponent', () => {
  let component: RegistreWorkerComponent;
  let fixture: ComponentFixture<RegistreWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistreWorkerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistreWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
