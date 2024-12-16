import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdcutosComponent } from './prodcutos.component';

describe('ProdcutosComponent', () => {
  let component: ProdcutosComponent;
  let fixture: ComponentFixture<ProdcutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdcutosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProdcutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
