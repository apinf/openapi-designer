export class Modal {
  open() {
    $(this.wrapper).removeClass('hidden');
  }
  close() {
    $(this.wrapper).addClass('hidden');
  }
}
