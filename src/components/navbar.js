'use strict';
import '../styles/navbar.css';
import h from 'snabbdom/h';
import routes from '../routes';

function view(model, handler) {

  const navItems = routes.map(route => {
    return h('li.nav-item',{
      class: {active: model.currentTab === route.id}
    },[
      h('a.nav-link', {
        class: {disabled: route.disabled, active: model.currentTab === route.id},
        attrs: {href: '#' + route.id, tabindex: route.disabled ? -1 : false}
      },[
        h('i.fa.fa-map-marker', { class: { 'd-none': model.currentTab !== route.id } }),
        route.name
      ])
    ])
  });

  return h('nav.navbar.navbar-expand-lg.navbar-dark.bg-dark.fixed-top', [
    h('a.navbar-brand', { attrs: { href: '#home' } }, [
      h('img', { attrs: { src: './images/gis_logo.png', alt:'GIS logo' } })
    ]),
    h('button.navbar-toggler', {
      attrs: {type: 'button', 'aria-controls': 'geops-navbar', 'aria-expanded': 'false', 'aria-label': 'Toggle navigation'}, 
      dataset: {toggle: 'collapse', target: '#geops-navbar'}
    }, [
      h('span.navbar-toggler-icon')
    ]),
    h('div#geops-navbar.collapse.navbar-collapse', [
      h('ul.navbar-nav', navItems)
    ])
  ]);
}

export default { view };