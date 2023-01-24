class chatWidget extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const style = `
    <style>
      .chat-widget {
        font-size: 1.6em;
        position: fixed;
        bottom: 1em;
        right: 1em;
        z-index: 10;

        padding: 0.4em 0.5em;
        border-radius: 50%;

        color: white;
        background-color: hsla(169, 100%, 16%, 1);
        box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.25)
      }
    </style>
    `

    const html = `
    ${style}
    <div class="chat-widget">
      <span>Chat</span>
    </div>
    `

    this.shadowRoot.innerHTML = html
  }

  connectedCallback() {}
  disconnectedCallback() {}
}

customElements.define('chat-widget', chatWidget)

export { chatWidget }
