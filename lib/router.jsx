import React from 'react';
import {mount} from 'react-mounter';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { FlowRouterMeta, FlowRouterTitle } from 'meteor/ostrio:flow-router-meta';

/**
 *  App
 */
import { AppProvider } from '/imports/ui/AppProvider.jsx';
import { Doc } from '/imports/ui/components/Doc/Doc.jsx';

FlowRouter.route('/', {
  name: 'home',
  action() {
    mount(AppProvider, {
      children: <Doc documentId={'1zpGZF55X8SHJi_kkor6gu5CnolxngXUV92PZbkSrKtw'} />
    });
  },
  title: 'Nijverhoek kennisbank',
  meta: {
    // <meta charset="UTF-8">
    charset: {
      charset: 'UTF-8'
    },

    // <meta name="keywords" content="Awes..">
    keywords: {
      name: 'keywords',
      itemprop: 'keywords',
      content: 'Nijverhoek kennisbank'
    },

    // <meta name="description" itemprop="description" property="og:description" content="Default desc..">
    description: {
      name: 'description',
      itemprop: 'description',
      property: 'og:description',
      content: 'Nijverhoek kennisbank is een huizenrenovatieproject in Rotterdam Fijenoord. Leer mee over het proces.' 
    },
    image: {
      name: 'twitter:image',
      itemprop: 'image',
      property: 'og:image',
      content: 'https://kennisbank.nijverhoekrotterdam.nl/images/logo-nijverhoek.png'
    },
    'og:type': 'website',
    'og:title'() {
      return document.title;
    },
    'og:site_name': 'Nijverhoek kennisbank',
    url: {
      property: 'og:url',
      itemprop: 'url',
      content() {
        return window.location.href;
      }
    },
    'twitter:card': 'summary',
    'twitter:title'() {
      return document.title;
    },
    'twitter:description': 'Nijverhoek kennisbank is een huizenrenovatieproject in Rotterdam Fijenoord. Leer mee over het proces.',
    // 'twitter:site': {
    //   name: 'twitter:site',
    //   value: '@twitterAccountName'
    // },
    // 'twitter:creator': {
    //   name: 'twitter:creator',
    //   value: '@twitterAccountName'
    // },
    'http-equiv': {
      'http-equiv': 'X-UA-Compatible',
      content: 'IE=edge,chrome=1'
    },
    robots: 'index, follow',
    google: 'notranslate'
  },
  link: {
    // <link rel="canonical" href="http://example.com">
    canonical() {
      return document.location.href;
    },

    // <link rel="image" sizes="500x500" href="http://example.com">
    image: {
      rel: 'image',
      sizes: '500x500',
      href: 'https://kennisbank.nijverhoekrotterdam.nl/images/logo-nijverhoek.png'
    },
    'shortcut icon': {
      rel: 'shortcut icon',
      type: 'image/x-icon',
      href: 'https://kennisbank.nijverhoekrotterdam.nl/images/logo-nijverhoek.png'
    },
    'icon': {
      rel: 'icon',
      type: 'image/png',
      href: 'https://kennisbank.nijverhoekrotterdam.nl/images/logo-nijverhoek.png'
    },
    'apple-touch-icon-144': {
      rel: 'apple-touch-icon',
      sizes: '144x144',
      href: 'https://kennisbank.nijverhoekrotterdam.nl/images/logo-nijverhoek.png'
    },
    'apple-touch-icon-114': {
      rel: 'apple-touch-icon',
      sizes: '114x114',
      href: 'https://kennisbank.nijverhoekrotterdam.nl/images/logo-nijverhoek.png'
    },
    'apple-touch-icon-72': {
      rel: 'apple-touch-icon',
      sizes: '72x72',
      href: 'https://kennisbank.nijverhoekrotterdam.nl/images/logo-nijverhoek.png'
    },
    'apple-touch-icon-57': {
      rel: 'apple-touch-icon',
      sizes: '57x57',
      href: 'https://kennisbank.nijverhoekrotterdam.nl/images/logo-nijverhoek.png'
    }
  }
});
FlowRouter.route('/d/:id', {
  action(params) {
    mount(AppProvider, {
      children: <Doc documentId={params.id} />
    });
  }
})

/**
 * Not found
 */
// FlowRouter.notFound = {
//   action: function() {
//   }
// }

// Scroll to top after navigations happens
const goScrollTop = function() {
  window.scrollTo(0, 0)
  document.getElementById('react-root').scrollTo(0, 0)
}
FlowRouter.triggers.exit([goScrollTop])

new FlowRouterMeta(FlowRouter);
new FlowRouterTitle(FlowRouter);
