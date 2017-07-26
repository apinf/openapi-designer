import {bindable} from 'aurelia-framework';

export class Tooltip {
  @bindable text = '';

  mouseover() {
    $(this.textbox).css({ display: 'inline-block' });
  }

  mousemove(event) {
    $(this.textbox).css({
      top: `${event.clientY + 12}px`,
      left: `${event.clientX + 12}px`
    });
  }

  mouseout() {
    $(this.textbox).css({
      top: 'auto',
      left: 'auto',
      display: 'none'
    });
  }
}
