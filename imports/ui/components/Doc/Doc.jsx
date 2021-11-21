import React, { useState, useEffect } from 'react'
import { marked } from 'marked'

const homeUnicodeSymbols = ['🏠', '🏡', '🏞️', '🌉', '🌃', '🏙️', '🌆', '🌌', '🎪', '🏕️']

export const Doc = (props) => {
  // State variables
  const [title, setTitle] = useState('')
  const [doc, setDoc] = useState('')
  const [counter, setCounter] = useState(0)
  // Other variables
  let TO_counter

  // Function fetchDoc :: fetched document from Google Docs
  const fetchDoc = () => {
    Meteor.call('docs.getFormattedDoc', props.documentId, (err, docInMarkdown) => {
      setDoc(docInMarkdown)
      Meteor.call('docs.updateDocContent', {
        documentId: props.documentId,
        content: docInMarkdown
      })
    })
  }

  // Every 5 seconds: increment counter
  // This is used for re-fetching the doc every 5 seconds
  useEffect(() => {
    TO_counter = setInterval((x) => {
      setCounter(counter + 1)
    }, 60 * 1000 * 30)

    return () => {
      clearInterval(TO_counter)
    }
  }, [counter])

  // Fetch document on load and if new documentId is given
  useEffect(() => {
    // Get random 'loading' title
    const randomLoadingTitle = homeUnicodeSymbols[Math.floor(Math.random() * homeUnicodeSymbols.length)]
    setTitle(randomLoadingTitle)
    Meteor.call('docs.getTitle', props.documentId, (err, title) => {
      setTitle(title)
      Meteor.call('docs.updateDocTitle', {
        documentId: props.documentId,
        title: title
      })
    })
  }, [props.documentId])

  // Fetch doc if documentId updates
  useEffect(() => {
    setDoc('...')
    fetchDoc()
  }, [props.documentId])

  // Fetch doc every x seconds
  useEffect(() => {
    fetchDoc()
  }, [counter])

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
          style={{marginLeft: '10px', fontSize: '30px'}}>
          📝
        </a>
      </h1>

      {/* <a href="/" className="
        text-xs
        font-semibold
        inline-block
        py-1
        px-2
        uppercase
        rounded
        uppercase last:mr-0 mr-1
        no-underline
        hover:text-black

        transition-transform duration-200 transform hover:scale-105
      " style={{
        color: '#f59e0b',
        backgroundColor: '#fde68a'
      }} title="Terug naar home">
        Nijverhoek kennisbank
      </a> */}

      <div
        dangerouslySetInnerHTML={{
          __html: marked(strippedDoc, { breaks: true })
        }}
      />
    </section>
  )
}
