import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[textWeight]',
})
export class TextWeightDirective implements OnInit {
  @Input('textWeight') weight: string;

  constructor(public el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.setWeight();
  }

  setWeight = () => {
    this.renderer.addClass(this.el.nativeElement, `font__weight--${this.weight}`);
  }
}
