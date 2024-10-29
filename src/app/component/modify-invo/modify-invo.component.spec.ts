import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyInvoComponent } from './modify-invo.component';

describe('ModifyInvoComponent', () => {
  let component: ModifyInvoComponent;
  let fixture: ComponentFixture<ModifyInvoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyInvoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyInvoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
