class TrustpilotWidget extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
		<!-- TrustBox widget - Micro Review Count -->
		<div class="trustpilot-widget" data-locale="en-GB" data-template-id="5419b6a8b0d04a076446a9ad" data-businessunit-id="6329c536a0b078b5c6101c24" data-style-height="24px" data-style-width="100%" data-theme="light" data-min-review-count="10" data-style-alignment="center">

  		<a href="https://uk.trustpilot.com/" target="_blank" rel="noopener">Trustpilot</a>
	  </div>
	  <!-- End TrustBox widget -->
			`
  }

  disconnectedCallback() {}
}

customElements.define('trustpilot-widget', TrustpilotWidget)

export { TrustpilotWidget }
