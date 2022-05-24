export class Accordion {
    constructor(element) {
        this.minHeight = 80;

        this.$container = element;
        this.$button = element.querySelector('.accordion-button');
        this.$content = element.querySelector('.accordion-content');
        this.collapsedHeight = this.$content.offsetHeight;
        this.expandedHeight = this.$content.scrollHeight;
        console.log(this.collapsedHeight);
        console.log(this.expandedHeight);

        this.isOpen = false;

        if (this.expandedHeight <= this.collapsedHeight) {
            this.$button.style.display = 'none';
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