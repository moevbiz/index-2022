export class Accordion {
    constructor(element) {
        this.minHeight = 80;

        this.$container = element;
        this.$button = element.querySelector('.accordion-button');
        this.$content = element.querySelector('.accordion-content');
        this.collapsedHeight = this.$content.offsetHeight;
        this.expandedHeight = this.$content.scrollHeight;

        this.isOpen = false;

        if (this.expandedHeight <= 80) {
            this.$button.style.display = 'none';
            this.open();
        }

        this.$button.addEventListener('click', e => {
            e.stopPropagation();
            if (!this.isOpen) {
                this.open();
            } else {
                this.close();
            }
        })
    }
    open() {
        this.$container.classList.add('is-open');
        this.isOpen = true;
        this.$content.style.height = this.expandedHeight + "px";
    }
    close() {
        this.$container.classList.remove('is-open');
        this.isOpen = false;
        this.$content.style.height = this.collapsedHeight + "px";
    }
}