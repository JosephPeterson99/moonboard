const styles = () =>
`<style>
	.header {
	  padding: 10px 16px;
	  background: #555;
	  color: #f1f1f1;
	}

	.sticky {
	  position: fixed;
	  top: 0;
	  width: 100%
	}
</style>`;


const template = () =>
`${styles()}
<div class="top-header" id="top-header>
	<h2>Test</h2>
</div>`;


class TopHeader extends HTMLElement {

  function init() {
	window.onscroll = function() {addSticky()};
	var header = document.getElementById("top-header");
	var sticky = header.offsetTop;
	function addSticky() {
	  if (window.pageYOffset > sticky) {
		header.classList.add("sticky");
	  } else {
		header.classList.remove("sticky");
	  }
	}
  }
  
  init();
  
}

customElements.define("top-header", TopHeader);
