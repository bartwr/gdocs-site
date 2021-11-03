import React from 'react';
import {mount} from 'react-mounter';

/**
 *  App
 */
import { App } from '/imports/ui/App.jsx';
import { Doc } from '/imports/ui/components/Doc/Doc.jsx';

FlowRouter.route('/', {
  action() {
    mount(App, {
      children: <Doc documentId={'1zpGZF55X8SHJi_kkor6gu5CnolxngXUV92PZbkSrKtw'} />
    });
  }
});
FlowRouter.route('/d/:id', {
  action(params) {
    mount(App, {
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
