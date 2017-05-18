import {bindable} from 'aurelia-framework';
import $ from 'jquery';
export class Tooltip {
  @bindable text = '';

  mouseover() {
    const textbox = $(this.textbox);
    textbox.removeClass('hidden');
    textbox.css({
      // Place the tooltip "popup" below the info button so the right edges align.
      top: textbox.offset().top + textbox.parent().height()
    });
  }

  mouseout() {
    const textbox = $(this.textbox);
    textbox.addClass('hidden');
    textbox.css({ top: 'auto' });
  }
}
