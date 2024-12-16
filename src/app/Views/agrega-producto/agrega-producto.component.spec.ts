import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregaProductoComponent } from './agrega-producto.component';

describe('AgregaProductoComponent', () => {
  let component: AgregaProductoComponent;
  let fixture: ComponentFixture<AgregaProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregaProductoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregaProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
