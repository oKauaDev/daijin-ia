import React from 'react'
import { PromptHistory } from '../../src/types/PromptHistory'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import Brain from '../../src/Daijin/Brain'
import { ReactSVG } from 'react-svg'
import MarkdownPreview from '@uiw/react-markdown-preview'
import './App.css'
import GeneratorIcon from '../../svgs/GeneratorIcon'
import ArrowLeft from '../../svgs/ArrowLeft'
import ArrowRight from '../../svgs/ArrowRight'
import DaijinLoading from '../../assets/daijin-loading.png'

function App(): JSX.Element {
  const promptRef = React.useRef<HTMLInputElement>(null)
  const [response, setResponse] = React.useState('')
  const [historyIndex, setHistoryIndex] = React.useState(0)
  const [history, setHistory] = React.useState<PromptHistory>([])
  const [loading, setLoading] = React.useState(false)

  const onSubmitInput = React.useCallback(async () => {
    const promptElement = promptRef.current

    if (promptElement) {
      const messages: ChatCompletionMessageParam[] = []

      if (history.length > 0) {
        history.map((h) => {
          messages.push({ role: 'user', content: h.prompt })
          messages.push({ role: 'assistant', content: h.response })
        })
      }

      const brain = new Brain()

      const promptValue = promptElement.value
      promptElement.value = ''
      setResponse('')
      setLoading(true)

      await brain.learn()

      let response = ''

      await brain.answer_this(messages, promptValue, (result) => {
        response += result
        setResponse((prev) => prev + result)
      })

      setLoading(false)
      setHistory((prev) => [...prev, { prompt: promptElement.value, response }])
      setHistoryIndex(history.length)
      setTimeout(() => {
        promptElement.focus()
      }, 500)
    }
  }, [history])

  const onArrowClick = React.useCallback(
    (type: 'right' | 'left') => {
      if (type === 'left') {
        const nindex = historyIndex - 1
        if (nindex >= 0) {
          setHistoryIndex(nindex)
          promptRef.current!.value = history[nindex].prompt
          setResponse(history[nindex].response)
        }
      } else {
        const nindex = historyIndex + 1
        if (nindex <= history.length - 1) {
          setHistoryIndex(nindex)
          promptRef.current!.value = history[nindex].prompt
          setResponse(history[nindex].response)
        }
      }
    },
    [history, historyIndex]
  )

  React.useEffect(() => {
    if (promptRef.current) {
      promptRef.current.focus()
    }
  }, [])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onSubmitInput()
      }
    },
    [onSubmitInput]
  )

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey) {
        switch (event.key) {
          case 'ArrowLeft':
            onArrowClick('left')
            break
          case 'ArrowRight':
            onArrowClick('right')
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onArrowClick])

  return (
    <>
      <div className="input-container">
        <div className="disparator">
          <GeneratorIcon />
          <input
            onKeyDown={onKeyDown}
            type="text"
            placeholder={loading ? 'Carregando resposta...' : 'O que quer ?'}
            disabled={loading}
            ref={promptRef}
          />
        </div>
        <div className="navigator">
          <button className="arrow" onClick={() => onArrowClick('left')}>
            <ArrowLeft />
          </button>
          <button className="viewNumber">
            {historyIndex + 1 > history.length
              ? `${historyIndex + 1}/${historyIndex + 1}`
              : `${historyIndex + 1 + (loading ? 1 : 0)}/${history.length + (loading ? 1 : 0)}`}
          </button>
          <button className="arrow" onClick={() => onArrowClick('right')}>
            <ArrowRight />
          </button>
          <button className="enter-decorator" onClick={onSubmitInput}>
            enter
          </button>
        </div>
      </div>
      <span className="separator"></span>
      {loading ? (
        <div className="loading-response">
          <img src={DaijinLoading} />
          <p>Estou gerando a sua resposta, normalmente não demoro mais de 10 segundos.</p>
        </div>
      ) : (
        <div className="view-contant">
          <MarkdownPreview
            source={response}
            style={{ fontSize: '16px', backgroundColor: 'transparent' }}
          />
        </div>
      )}
    </>
  )
}

export default App
