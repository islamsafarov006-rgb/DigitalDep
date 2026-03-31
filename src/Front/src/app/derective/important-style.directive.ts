import {Directive, ElementRef, inject, Input, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appImportantStyle]',
  standalone: true
})
export class ImportantStyleDirective implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input('appImportantStyle') styles: { [key: string]: string } = {};

  constructor() {}

  ngOnInit() {
    this.applyStyles();
  }

  private applyStyles() {
    const element = this.el.nativeElement;

    Object.keys(this.styles).forEach(property => {
      const value = this.styles[property];
      element.style.setProperty(property, value, 'important');
    });
  }
}
