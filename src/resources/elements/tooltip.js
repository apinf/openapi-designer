import {bindable} from 'aurelia-framework';

export class Tooltip {
  @bindable text = '';

  mouseover() {
    // Make the tooltip popup visible.
    this.textbox.style.display = 'inline-block';
    // Place the tooltip popup below the info button so the right edges align.
    this.textbox.style.top = this.textbox.offsetTop + this.textbox.parentNode.offsetHeight + 'px';
  }

  mouseout() {
    this.textbox.style.display = 'none';
    // Reset the top value so that the tooltip popup doesn't go lower each time
    // you hover over the box.
    this.textbox.style.top = 'auto';
  }
}
