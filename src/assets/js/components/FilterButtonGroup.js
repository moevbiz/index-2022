import { FilterButton } from './FilterButton';

export class FilterButtonGroup {
    constructor(qs) {
        this.$els = [];
        document.querySelectorAll(qs).forEach(el => {
            this.$els.push(new FilterButton(el));
        });
        return this.$els;
    }
}