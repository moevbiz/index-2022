export class FilterButton {
    constructor(el) {
        this.$el = el;
        this.value = el.dataset.filterValue;
        this.$el.addEventListener('click', e => {
            window.app.filterBy(this.value);
            this.select();
        })
    }
    select() {
        window.app.$filterButtons.forEach(btn => {
            btn.$el.classList.remove('is-active');
        })
        this.$el.classList.add('is-active');
    }
}