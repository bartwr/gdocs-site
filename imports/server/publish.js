// Import models
import {Docs} from '/imports/models/Docs.js';

Meteor.publish('doc.one', function (documentId) {
  return Docs.find({
    documentId: documentId
  })
})
