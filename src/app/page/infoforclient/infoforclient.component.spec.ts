import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoforclientComponent } from './infoforclient.component';

describe('InfoforclientComponent', () => {
  let component: InfoforclientComponent;
  let fixture: ComponentFixture<InfoforclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoforclientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoforclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
