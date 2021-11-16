import { Mongo } from 'meteor/mongo';
// import SimpleSchema from 'simpl-schema';

const Docs = new Mongo.Collection('Docs')

// const schema = new SimpleSchema({
  // _id STRING,
  // documentId STRING,
  // title STRING,
  // content STRING
// })

export {Docs}
