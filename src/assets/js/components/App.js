import { Map } from './Map';
import { Logo } from './Logo';
import Swup from 'swup';
import SwupBodyClassPlugin from '@swup/body-class-plugin';
import { scrollToY } from '../tools';
import { NewsletterForm } from "./NewsletterForm";
import { FilterButtonGroup } from './FilterButtonGroup';
import { marker } from 'leaflet';
import { appHeight } from "../tools";
import { Accordion } from './Accordion';
import { ShowOnMapButton } from './ShowOnMapButton';

let swup;

export class App {
    constructor() {
        this.state = {
            space: window.location.pathname.includes('/program') ? window.location.hash.substr(1) : '',
            panelOpen: false,
            logoHidden: false,
            useActiveArea: 
                window.location.pathname.includes('/program') || 
                window.location.pathname.includes('/events') ||
                window.location.pathname.includes('/info'),
            view: window.location.pathname ? window.location.pathname : 'index',
            filter: 'all',
        };
        this.$logo = new Logo('#logo');
        this.$filterButtons = new FilterButtonGroup('nav.filters button');
        this.data = '';
        this.getData().then(data => this.init(data));
        appHeight();
    }
    async getData() {
        let response = await fetch('/locations.json');
        let data = await response.json();
        return data;
    }
    setState(state = {}) {
        this.state = {...this.state, ...state};
        for (const [key, value] of Object.entries(this.state)) {
            document.body.dataset[key] = value;
        }
    }
    afterLoad() {
        this.setState({
            useActiveArea: window.location.pathname.includes('/program') || window.location.pathname.includes('/events'),
            view: window.location.pathname,
            logoHidden: this.$logo.$el.classList.contains('is-hidden'),
        })
        
        this.$spaces = document.querySelectorAll('.space');
        if (this.$spaces) {
            this.$spaces.forEach(s => {
                s.addEventListener('click', e => {
                    this.selectSpace(s.id);
                })
            })
        }

        this.$accordions = document.querySelectorAll('.accordion');
        if (this.$accordions) {
            this.$accordions.forEach(acc => new Accordion(acc));
        }

        this.$showOnMapButtons = document.querySelectorAll('.show-on-map');
        if (this.$showOnMapButtons) {
            this.$showOnMapButtons.forEach(b => new ShowOnMapButton(b));
        }

        if (window.location.pathname.includes('/program') && this.state.space) {
            this.selectSpace(this.state.space);
        } 
        // else {
        //     this.unselectSpace();
        // }

        if (document.querySelector('.signup-form')) {
            new NewsletterForm('.signup-form');
        }

        if (!window.location.pathname.includes('program') || !this.state.space) {
            window.scrollTo(0,0);
        }

        this.updateMenu();
    }
    setView(options) {
        if (options.view == 'space') {
            let st;
            let hash = `#${options.space}`;
            if (window.location.pathname.includes('/program')) {
                // window.location.hash = hash;
                // this.update();
                // this.selectSpace(options.space);
                st = {};
            } else {
                this.swup.loadPage({
                    url: `/program/${hash}`, // route of request (defaults to current url)
                });
                st = {useActiveArea: true, space: options.space};
            }

            this.setState({
                ...st,
                // view: 'space',
            })
        }
    }
    updateMenu() {
        this.$menuElements.forEach(el => {
            if (this.state.view == el.dataset.view) {
                el.classList.add('is-active-element');
            } else {
                el.classList.remove('is-active-element');
            }
        })
    }
    unselectSpace() {
        this.$map.markers.forEach(m => {
            m._icon.classList.remove('marker-icon-selected');
        })
        this.$spaces.forEach(s => {
            s.classList.remove('is-selected');
        });
        history.pushState({}, '', window.location.pathname + window.location.search);
        this.setState({space: ''});
    }
    selectSpace(space) {
        let marker;
        this.$map.markers.forEach(m => {
            if (m.options.title == space) {
                marker = m;
                m._icon.classList.add('marker-icon-selected');
                // m.setIcon(this.$map.markerIcons.selected);
            } else {
                m._icon.classList.remove('marker-icon-selected');
                // m.setIcon(this.$map.markerIcons.default);
            }
        })
        this.$map.$map.panTo(marker.getLatLng());
        this.setState({space});
        if (this.$spaces) {
            this.$spaces.forEach(s => {
                if (s.id == this.state.space) {
                    s.classList.add('is-selected');
                    scrollToY(s.offsetTop, this.view == '/program/' ? 1500 : 0, 'easeInOutQuint');
                    // s.scrollIntoView({
                    //     behavior: 'smooth'
                    // });
                } else {
                    s.classList.remove('is-selected');
                }
            })
        }
        history.replaceState({}, '', '#' + this.state.space);
    }
    filterBy(value) {
        this.setState({filter: value});
        let query = value == 'all' ? window.location.pathname : `?filter=${value}`
        history.replaceState({}, '', query);
        
        this.$spaces.forEach(s => {
            console.log(s.querySelectorAll('.program-element'));

            let programElements = s.querySelectorAll('.program-element');

            if (value == 'all') {
                s.classList.remove('is-hidden');
                programElements.forEach(p => {
                    p.classList.remove('is-hidden');
                })
                return;
            }

            programElements.forEach(programElement => {
                if (programElement.dataset.type == value) {
                    programElement.classList.remove('is-hidden');
                } else {
                    programElement.classList.add('is-hidden');
                }
            })

            if (s.dataset.programTypes.split(',').includes(value)) {
                s.classList.remove('is-hidden');
            } else {
                s.classList.add('is-hidden');
            }
        })
        this.$map.filterBy(value);
    }
    init(data) {
        this.setState();
        this.$map = new Map('map', data);
        this.$menuElements = document.querySelectorAll('nav .menu-link');
        this.swup = new Swup({
            plugins: [new SwupBodyClassPlugin()],
        });
        this.swup.on('contentReplaced', () => {
            this.afterLoad();
        });

        // hide logo on init
        ['click','ontouchstart', 'scroll'].forEach( evt => 
            document.addEventListener(evt, () => {
                if (this.state.logoHidden != true) {
                    this.setState(this.$logo.hide());
                }
            }, {once: true}),
        );

        ['zoomstart', 'movestart'].forEach((evt) => {
            this.$map.$map.on(evt, () => {
                if (this.state.logoHidden != true) {
                    this.setState(this.$logo.hide());
                }
            }, {once: true})
        })

        
        const markerClickHandler = (m, e) => {
            if (window.location.pathname.includes('/program')) {
                this.selectSpace(m.options.title);
            } else {
                this.setView({
                    view: 'space',
                    space: m.options.title,
                    trigger: e.target,
                })
            }
        }

        let tapTolerance = 200;
        let literallyJustTapped = false;
        
        this.$map.markers.forEach(m => {
            m.on('click', (e) => {
                if (window.innerWidth > 660) {
                    markerClickHandler(m, e);
                } else {
                    if (literallyJustTapped) return;
                    literallyJustTapped = true;
                    this.$map.markers.forEach(m => {
                        if (m == e.target) return;
                        m._icon.classList.remove('marker-icon-selected');
                        m._icon.classList.remove('is-clicked-once');
                    })
                    if (!m._icon.classList.contains('is-clicked-once')) {
                        m._icon.classList.add('is-clicked-once');
                    } else {
                        markerClickHandler(m, e);
                        m._icon.classList.remove('is-clicked-once');
                    }

                    // fix safari double click/tap bug
                    window.setTimeout(() => {
                        literallyJustTapped = false;
                    }, tapTolerance);
                }
            })
        });

        if (this.state.space) {
            this.setView({
                view: 'space',
                space: this.state.space,
            })
        }

        this.$map.$map.on('click', e => {
            this.unselectSpace();
            this.$map.markers.forEach(m => {
                m._icon.classList.remove('is-clicked-once');
            });
        })

        this.afterLoad();
    }
}