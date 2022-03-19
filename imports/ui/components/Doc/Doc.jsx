import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { saveDocTitle, saveDocContent } from '/imports/reducers/doc'
import { findDocument } from '/imports/reducers/doc'
import { marked } from 'marked'
import slugify from 'slugify'

import { updateGoogleLinksToLocalLinks, openExternalLinksInNewTab, loadImages } from './DocUtils.js'

const homeUnicodeSymbols = ['🏠', '🏡', '🏞️', '🌉', '🌃', '🏙️', '🌆', '🌌', '🎪', '🏕️']

function scrollToTargetAdjusted(elementId) {
  const element = document.getElementById(elementId)
  if (!element) return

  const isHeaderVisible = document.documentElement.classList.contains('Header--visible')
  const headerOffset = isHeaderVisible ? document.getElementById('Header').offsetHeight : 0

  const elementPosition = element.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })
}

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
  const [tocContent, setTocContent] = useState([])

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

  // Update ToC if doc updates
  useEffect(
    (x) => {
      generateToc()
    },
    [doc]
  )

  // On page load: navigate to URL hash
  useEffect(() => {
    scrollIfImagesAreLoaded = async () => {
      const urlHash = window.location.toString().split('#')[1]
      const imageSrcArray = [].slice.call(document.images).map((img) => {
        return img.src
      })
      // Scroll after 1.5 second or if all images are loaded
      const TO_forceScrollAfterTimeout = setTimeout((x) => {
        scrollToTargetAdjusted(urlHash)
      }, 2000)
      // Wait on images loading
      await loadImages(imageSrcArray)
      // Scroll after all images are loaded
      clearTimeout(TO_forceScrollAfterTimeout)
      scrollToTargetAdjusted(urlHash)
    }
    scrollIfImagesAreLoaded()
  }, [doc])

  // useEffect(() => {
  //   Meteor.call('docs.getDoc', props.documentId, (err, theDoc) => {
  //     console.log(theDoc)
  //   })
  // }, [props.documentId])

  // Fetch doc if documentId updates
  useEffect(() => {
    fetchDoc()
  }, [props.documentId])

  // Strip comments from doc
  const strippedDoc = doc && doc.indexOf('---') > -1 ? doc.split('---')[2] : doc ? doc : ''

  // Generate Table of Contents with different levels
  // https://github.com/markedjs/marked/issues/545#issuecomment-495093214
  const generateToc = () => {
    const toc = []
    var renderer = (function () {
      var renderer = new marked.Renderer()
      renderer.heading = function (text, level, raw) {
        var anchor = slugify(raw.toLowerCase())
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

    let fullCtx = []
    fullCtx.push('<ol>')
    build(toc, 0, 0, fullCtx)
    fullCtx.push('</ol>')
    setTocContent(fullCtx)

    // Scroll to element smoothly if outline link is clicked
    setTimeout((x) => {
      const clickHandler = (e) => {
        // Prevent the default action
        e.preventDefault()
        // Get the `href` attribute
        const href = e.target.getAttribute('href')
        const id = href.substr(1)
        const target = document.getElementById(id)
        // Scroll to element
        scrollToTargetAdjusted(id)
        // Update URL hash
        updateUrlHash(id)
      }
      const updateUrlHash = (hash) => {
        const location = window.location.toString().split('#')[0]
        history.replaceState(null, null, location + '#' + hash)
      }
      const triggers = [].slice.call(document.querySelectorAll('.animate-scroll'))
      triggers.forEach(function (el) {
        el.removeEventListener('click', clickHandler)
      })
      triggers.forEach(function (el) {
        el.addEventListener('click', clickHandler)
        el.addEventListener('click', () => closeToC())
      })
    }, 5)
  }

  const toggleToC = () => {
    setToCMode((isToCOpen) => !isToCOpen)
    document.documentElement.classList.toggle('ToC--toggled')
  }

  const closeToC = () => {
    setToCMode(false)
    document.documentElement.classList.remove('ToC--toggled')
  }

  const parseTable = (s) => {
    return s.indexOf('<table>') >= 0 ? s.replace(/<table>/g, '<div><table>').replace(/<\/table>/g, '</table></div>') : s
  }

  const titleContainsParent = (title) => title.startsWith(`${title}: `)
  const parseParent = (title) => title.split(':')[0].trim()
  const parseTitle = (title) => titleContainsParent(title) ? title.replace(`${title}: `, '').trim() : title

  return (
    <>
      {/* Table of Contents */}
      <section className='ToC'>
        <div className='ToC__inner'>
          {/* Desktop title */}
          <h2 className='ToC__title'>Inhoud</h2>

          {/* Mobile button */}
          <button className='ToC__toggle' aria-expanded={isToCOpen} onClick={() => toggleToC()}>
            <span className='ToC__toggle-label'>Inhoud</span>
            <svg className='ToC__toggle-icon'>
              <use xlinkHref='#icon--chevron' />
            </svg>
          </button>

          <div
            className='ToC__content'
            aria-hidden={!isToCOpen}
            dangerouslySetInnerHTML={{ __html: tocContent.join('') }}
          />
        </div>
      </section>

      {/* Content */}
      <section className='Content text--styled'>
        {titleContainsParent(title) && <p className='Content__category'>{parseParent(title)}</p>}

        <h1>
          <span className='Content__title'>{parseTitle(title)}</span>
          <a
            href={`https://docs.google.com/document/d/${props.documentId}/edit`}
            target='_blank'
            rel='external'
            title='Bewerk in Google Docs'
            className='Content__edit'
          >
            bewerk
          </a>
        </h1>

        <div
          dangerouslySetInnerHTML={{
            __html: parseTable(marked(strippedDoc, { breaks: true }))
          }}
          style={{ overflow: 'hidden' }}
        />
      </section>
    </>
  )
}
