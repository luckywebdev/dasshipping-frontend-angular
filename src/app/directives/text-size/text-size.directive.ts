import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[textSize]',
})
export class TextSizeDirective implements OnInit {
  @Input('textSize') size: string;

  constructor(public el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.setSize();
  }

  setSize() {
    this.renderer.addClass(this.el.nativeElement, `font__size--${this.size}`);
  }
}
