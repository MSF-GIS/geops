'use strict';

import h from 'snabbdom/h';
import routes from '../routes';

function view(model, handler) {

  const navItems = routes.map(route => {
    return h('li.nav-item',[
      h('a.nav-link', {
        class: {
          disabled: route.disabled,
          active: model.currentTab === route.id
        },
        attrs: {
          href: '#' + route.id
        }
      }, route.name)
    ])
  });

  return h('nav.navbar.navbar-expand-lg.navbar-light.bg-light', [
    h('a.navbar-brand', {
      attrs: {
        href: '#home'
      }
    }, 'Geops'),
    h('button.navbar-toggler', {
      attrs: { 
        type: 'button', 
        'aria-controls': 'geops-navbar',
        'aria-expanded': 'false',
        'aria-label': 'Toggle navigation'
      }, 
      dataset: {
        toggle: 'collapse',
        target: '#geops-navbar'
      }
    }, [
      h('span.navbar-toggler-icon')
    ]),
    h('div#geops-navbar.collapse.navbar-collapse', [
      h('ul.navbar-nav', navItems)
    ])
  ]);
}

export default { view };