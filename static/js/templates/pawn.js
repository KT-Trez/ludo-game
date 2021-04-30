console.log('Loaded template: board.js');

const lobby = { // eskportowany szablon pionka
  mount(pawn) { // montowanie i uruchamianie szablonu
    let newTemplate = this.template.replace('{{playerColor}}', 'js-' + pawn.player);
    return newTemplate;
  },
  template: // szablon planszy
    `
    <div class="js-pawn-box">
      <div class="js-pawn-box__pawn">
        <div class="js-pawn-box__pawn--color {{playerColor}}">
        </div>
      </div>
    </div>
    `
}

export default lobby;