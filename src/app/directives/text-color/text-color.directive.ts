import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[textColor]',
})
export class TextColorDirective implements OnInit {
  @Input('textColor') color: string;

  constructor(public el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.setColor();
  }

  setColor = () => {
    this.renderer.addClass(this.el.nativeElement, `text__color--${this.color}`);
  }
}
