class TabMenu extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <!-- side-menu -->
    <!------------------------ -->
    <aside class="side-menu">
      <div class="tab">Menu</div>
      <div class="menu">
        <!-- @global-nav -->
        <global-nav></global-nav>
      </div>
    </aside>    
      `
  }

  disconnectedCallback() {}
}

customElements.define('tab-menu', TabMenu)

export { TabMenu }
