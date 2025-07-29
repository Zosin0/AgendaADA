import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContatoPerfil } from './contato-perfil';

describe('ContatoPerfil', () => {
  let component: ContatoPerfil;
  let fixture: ComponentFixture<ContatoPerfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContatoPerfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContatoPerfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
