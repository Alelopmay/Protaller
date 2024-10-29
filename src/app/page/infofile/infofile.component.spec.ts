import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfofileComponent } from './infofile.component';

describe('InfofileComponent', () => {
  let component: InfofileComponent;
  let fixture: ComponentFixture<InfofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfofileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
