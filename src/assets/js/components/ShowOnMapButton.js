export class ShowOnMapButton {
    constructor(el) {
        this.$el = el;
        this.$el.addEventListener('click', e => {
            window.app.selectSpace(this.$el.dataset.id);
            window.app.swup.loadPage({url: '/'});
        })
    }
}