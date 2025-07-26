import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContatoItem } from './contato-item';

describe('ContatoItem', () => {
  let component: ContatoItem;
  let fixture: ComponentFixture<ContatoItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContatoItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContatoItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
