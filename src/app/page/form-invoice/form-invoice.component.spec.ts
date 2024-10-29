import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInvoiceComponent } from './form-invoice.component';

describe('FormInvoiceComponent', () => {
  let component: FormInvoiceComponent;
  let fixture: ComponentFixture<FormInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInvoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
