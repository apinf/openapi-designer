import {bindable} from 'aurelia-framework';

export class Tooltip {
  @bindable text = '';

  mouseover() {
    const textbox = $(this.textbox);
    textbox.css({ display: 'inline-block' });
    const formDiv = $('.form');
    const body = $('body');
    const wrapper = formDiv.css('overflow-y') === 'auto' ? formDiv : body;
    textbox.css({
      top: `${textbox.offset().top - wrapper.offset().top}px`
    });
  }

  mouseout() {
    $(this.textbox).css({
      top: 'auto',
      display: 'none'
    });
  }
}
