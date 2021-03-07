import { NgModule } from '@angular/core';

import { TextColorDirective } from './directives/text-color/text-color.directive';
import { TextSizeDirective } from './directives/text-size/text-size.directive';
import { TextWeightDirective } from './directives/text-weight/text-weight.directive';

@NgModule({
  declarations: [
    TextColorDirective,
    TextSizeDirective,
    TextWeightDirective,
  ],
  exports: [TextColorDirective, TextSizeDirective, TextWeightDirective],
})
export class DirectivesModule { }
