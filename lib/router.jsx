import React from 'react';
import {mount} from 'react-mounter';

/**
 *  App
 */
import { AppProvider } from '/imports/ui/AppProvider.jsx';
import { Doc } from '/imports/ui/components/Doc/Doc.jsx';

FlowRouter.route('/', {
  action() {
    mount(AppProvider, {
      children: <Doc documentId={'1zpGZF55X8SHJi_kkor6gu5CnolxngXUV92PZbkSrKtw'} />
    });
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
