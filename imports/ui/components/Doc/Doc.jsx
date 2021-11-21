import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { saveDocTitle, saveDocContent } from '/imports/reducers/doc'
import { findDocument } from '/imports/reducers/doc'
import { marked } from 'marked'

const homeUnicodeSymbols = ['🏠', '🏡', '🏞️', '🌉', '🌃', '🏙️', '🌆', '🌌', '🎪', '🏕️']

export const Doc = (props) => {
  const dispatch = useDispatch()
  const documentsArray = useSelector((state) => state.doc)

  // State variables
  const [title, setTitle] = useState('')
  const [doc, setDoc] = useState('')

  // Function fetchDoc :: fetched document from Google Docs
  const fetchDoc = () => {
    // Get document from store
    const documentFromStore = findDocument(documentsArray, props.documentId)
    if(documentFromStore) {
      setTitle(documentFromStore.title);
      setDoc(documentFromStore.content);
    } else {
      // Get random 'loading' title
      const randomLoadingTitle = homeUnicodeSymbols[Math.floor(Math.random() * homeUnicodeSymbols.length)]
      // Set 'loading' title & doc
      setTitle(randomLoadingTitle)
      setDoc('...')
    }
    // Now get latest version from Google Drive
    Meteor.call('docs.getFormattedDoc', props.documentId, (err, docInMarkdown) => {
      setDoc(docInMarkdown)
      // Save doc content in Redux store
      dispatch(saveDocContent({
        documentId: props.documentId,
        content: docInMarkdown
      }));
      // Save doc content in database
      Meteor.call('docs.updateDocContent', {
        documentId: props.documentId,
        content: docInMarkdown
      })
    })
  }

  // Fetch document on load and if new documentId is given
  useEffect(() => {
    Meteor.call('docs.getTitle', props.documentId, (err, title) => {
      setTitle(title)
      // Save doc content in Redux store
      dispatch(saveDocTitle({
        documentId: props.documentId,
        title: title
      }));
      // Save doc title in database
      Meteor.call('docs.updateDocTitle', {
        documentId: props.documentId,
        title: title
      })
    })
  }, [props.documentId])

  // Fetch doc if documentId updates
  useEffect(() => {
    fetchDoc()
  }, [props.documentId])

  // Strip comments from doc
  const strippedDoc = doc && doc.indexOf('---') > -1 ? doc.split('---')[2] : doc ? doc : ''

  return (
    <section className='Content text--styled'>
      <h1>
        {title}
        <a
          href={`https://docs.google.com/document/d/${props.documentId}/edit`}
          target='_blank'
          rel='external'
          title='Bewerk in Google Docs'
          style={{marginLeft: '1rem', fontSize: '1rem', fontWeight: 'normal'}}>
          bewerk
        </a>
      </h1>

      <div
        dangerouslySetInnerHTML={{
          __html: marked(strippedDoc, { breaks: true })
        }}
      />
    </section>
  )
}
