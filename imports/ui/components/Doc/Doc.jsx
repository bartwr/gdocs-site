import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { saveDocTitle, saveDocContent } from '/imports/reducers/doc'
import { findDocument } from '/imports/reducers/doc'
import { marked } from 'marked'
import { updateGoogleLinksToLocalLinks, openExternalLinksInNewTab } from './DocUtils.js'

const homeUnicodeSymbols = ['🏠', '🏡', '🏞️', '🌉', '🌃', '🏙️', '🌆', '🌌', '🎪', '🏕️']

export const Doc = (props) => {
  const dispatch = useDispatch()

  // Get documents from store
  const documentsArray = useSelector((state) => state.doc)

  // Get folder from store
  const folderFromStore = useSelector((state) => state.folder)

  // State variables
  const [title, setTitle] = useState('')
  const [doc, setDoc] = useState('')
  const [isToCOpen, setToCMode] = useState(false)

  // Function fetchDoc :: fetches document from Google Docs
  const fetchDoc = () => {
    // Get document from store
    const documentFromStore = findDocument(documentsArray, props.documentId)
    if (documentFromStore) {
      setTitle(documentFromStore.title)
      setDoc(documentFromStore.content)
    } else {
      // Get random 'loading' title
      const randomLoadingTitle = homeUnicodeSymbols[Math.floor(Math.random() * homeUnicodeSymbols.length)]
      // Set 'loading' title & doc
      setTitle(randomLoadingTitle)
      setDoc('...')
    }
    // Now get latest version from Google Drive
    Meteor.call('docs.getFormattedDoc', props.documentId, (err, docInMarkdown) => {
      const docWithReplacedDriveLinks = updateGoogleLinksToLocalLinks(docInMarkdown, folderFromStore)
      setDoc(docWithReplacedDriveLinks)
      // Save doc content in Redux store
      dispatch(
        saveDocContent({
          documentId: props.documentId,
          content: docWithReplacedDriveLinks
        })
      )
      // Save doc content in database
      Meteor.call('docs.updateDocContent', {
        documentId: props.documentId,
        content: docWithReplacedDriveLinks
      })
      openExternalLinksInNewTab()
    })
  }

  // Fetch document on load and if new documentId is given
  useEffect(() => {
    Meteor.call('docs.getTitle', props.documentId, (err, title) => {
      setTitle(title)
      // Save doc content in Redux store
      dispatch(
        saveDocTitle({
          documentId: props.documentId,
          title: title
        })
      )
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

  // Generate Table of Contents with different levels
  // https://github.com/markedjs/marked/issues/545#issuecomment-495093214
  const toc = []
  var renderer = (function () {
    var renderer = new marked.Renderer()
    renderer.heading = function (text, level, raw) {
      var anchor = this.options.headerPrefix + raw.toLowerCase().replace(/[^\w\\u4e00-\\u9fa5]]+/g, '-')
      toc.push({ anchor: anchor, level: level, text: text })
      return `<h${level}>${text} <span id="${anchor}" /></h${level}>`
    }
    return renderer
  })()

  marked.setOptions({ renderer: renderer })
  function build(coll, k, level, ctx) {
    if (k >= coll.length || coll[k].level <= level) {
      return k
    }
    var node = coll[k]
    ctx.push(`<li><a href='#${node.anchor}' class='animate-scroll'>${node.text}</a>`)
    k++
    var childCtx = []
    k = build(coll, k, node.level, childCtx)
    if (childCtx.length > 0) {
      ctx.push('<ol>')
      childCtx.forEach(function (idm) {
        ctx.push(idm)
      })
      ctx.push('</ol>')
    }
    ctx.push('</li>')
    k = build(coll, k, level, ctx)
    return k
  }
  var html = marked(strippedDoc)
  var ctx = []
  ctx.push('<ol>')
  build(toc, 0, 0, ctx)
  ctx.push('</ol>')

  // Scroll to element smoothly if outline link is clicked
  const triggers = [].slice.call(document.querySelectorAll('.animate-scroll'))
  triggers.forEach(function (el) {
    const clickHandler = (e) => {
      // Prevent the default action
      e.preventDefault()
      // Get the `href` attribute
      const href = e.target.getAttribute('href')
      const id = href.substr(1)
      const target = document.getElementById(id)
      target.scrollIntoView({ behavior: 'smooth' })
    }
    el.addEventListener('click', clickHandler);
    el.addEventListener('click', () => closeToC());
  })

  const toggleToC = () => {
    setToCMode((isToCOpen) => !isToCOpen)
    document.documentElement.classList.toggle('ToC--toggled')
  }

  const closeToC = () => {
    setToCMode(false)
    document.documentElement.classList.remove('ToC--toggled')
  }

  return (
    <>
      {/* Table of Contents */}
      <section className='ToC'>
        <div className='ToC__inner'>
          {/* Desktop title */}
          <h2 className='ToC__title'>Inhoud</h2>

          {/* Mobile button */}
          <button className='ToC__toggle' aria-expanded={isToCOpen} onClick={() => toggleToC()}>
            <span className="ToC__toggle-label">Inhoud</span>
            <svg className="ToC__toggle-icon">
              <use xlinkHref="#icon--chevron" />
            </svg>
          </button>

          <div className="ToC__content" aria-hidden={!isToCOpen} dangerouslySetInnerHTML={{ __html: ctx.join('') }} />
        </div>
      </section>
      
      {/* Content */}
      <section className='Content text--styled'>
        <h1>
          <span className='Content__title'>{title}</span>
          <a
            href={`https://docs.google.com/document/d/${props.documentId}/edit`}
            target='_blank'
            rel='external'
            title='Bewerk in Google Docs'
            className="Content__edit"
          >
            bewerk
          </a>
        </h1>

        <div
          dangerouslySetInnerHTML={{
            __html: marked(strippedDoc, { breaks: true })
          }}
        />
      </section>
    </>
  )
}
