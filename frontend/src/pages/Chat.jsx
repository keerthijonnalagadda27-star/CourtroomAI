// This is the main chat interface of CourtroomAI


import {useState, useEffect, useRef} from 'react'

// useState — store messages, current question, loading state
// useEffect — runs code when page first loads
// useRef — used to auto-scroll to bottom when new message arrives

import {useNavigate} from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

import { useTranslation } from 'react-i18next'
import i18n from '../i18n/index.js'

import api from '../api/axios'

function Chat(){
    const navigate=useNavigate()
    const {t}= useTranslation()
    const[messages,setMessages]=useState([
        {
            sender:'ai',
            text: 'Hello! I am CourtroomAI ⚖️ I can help you understand your legal rights under Indian law. What is your legal question today?'
        }
    ])
    const[question,setQuestion]=useState('')
    const[loading,setLoading]=useState(false)        
    //true = waiting for AI response, false = ready for user input

    const bottomRef=useRef(null)

    useEffect(()=>{
        bottomRef.current?.scrollIntoView({behavior:'smooth'})
        // scrollIntoView scrolls that element into view
    },[messages])
    // whenever messages change, scroll to bottom so new message is visible
    useEffect(()=>{
        const token=localStorage.getItem('token')
        if(!token){
            navigate('/')
        }
    },[])
    const[ipcQuery,setIpcQuery]=useState('')
    const[ipcResults,setIpcResults]=useState([])
    const[showIpcSearch,setShowIpcSearch]=useState(false)


    const handleSend=async()=>{
        if(!question.trim()) return

        const userMessage={sender:'user',text:question}
        setMessages(prev=>[...prev,userMessage])
        // ...ni spread operator antaru. const nums=[1,2,3] aithe,  [...nums]=[1,2,3],  [0,...nums]=[0,1,2,3] ala manipulate kuda cheyachu. ikkada prev anedhi oka array..aa array lo mana user adigina current messages induloki ostai..
        setQuestion('')
        setLoading(true)


        try{
            const response=await api.post('/legal/ask',{
                question:question

            })
            const aiMessage={sender:'ai',text:response.data.answer}
            setMessages(prev=>[...prev,aiMessage])
        } catch (err) {
            setMessages(prev=>[...prev,{sender:'ai',text:'Sorry, something went wrong. Please try again.'}])
        } finally {
            setLoading(false)
        }
    }
    const handleGenerateNotice=async()=>{
      // this function calls the notice generator endpoint
      // downloads the PDF directly to user's computer

      if(!question.trim()) return 

      setLoading(true)

      try{
        const response=await api.post('/legal/generate-notice',
          {question:question},
          {responseType:'blob'}
          // responseType: 'blob' tells axios to treat response as binary file
          // blob = Binary Large Object — raw file data
          // without this axios tries to parse PDF as JSON and fails
        )

        const url=window.URL.createObjectURL(new Blob([response.data]))
        //createObjectURL creates a temp URL pointing to the pdf data
        //new Blob([response.data]) wrap chestadi data into a blob obj
        //ee url ni mana regular file url la vadachu

        const link=document.createElement('a')
        // create a temporary invisible <a> tag
        // we use this to trigger the download

        link.setAttribute('download','legal_notice.pdf')
        //download attribute browser ki download cheyamani cheptadi instead of navigating

        document.body.appendChild(link)
        link.href=url

        link.click()
        document.body.removeChild(link)

        setMessages(prev=>[...prev,{
          sender:'ai',
          text:'📄 Your legal notice has been generated and downloaded! Check your Downloads folder.'
        }])
      }
      catch(err){
        setMessages(prev=>[...prev,{
          sender:'ai',
          text:'Sorry, could not generate the notice. Please try again.'
        }])
      }
      setLoading(false)
    }
        const handleKeyPress=(e)=>{
            if(e.key==='Enter' && !e.shiftKey){
                e.preventDefault()
                handleSend()
            }
       }
       const handleLogout=()=>{
        localStorage.removeItem('token')
        window.location.href='/'
       }
       const handleVoiceInput=()=>{
        const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition

        if(!SpeechRecognition) {
          alert('Voice input not supported. Please use Chrome or Edge.')
          return
        }
        const recognition= new SpeechRecognition()
        // creating a new speech recognition instance like it means creating a new microphone session

        recognition.lang=i18n.language==='hi'?'hi-IN': i18n.language==='te'?'te-IN':'en-IN'
        recognition.maxAlternatives = 1


        recognition.continuous=false
        // ante oka pause first time raagane aapey anutundi vinadam

        recognition.start()

        setQuestion('🎤 Listening...')
        recognition.onresult=(event)=>{
          const transcript=event.results[0][0].transcript

          // event .results mana results set anamata..first[0] ante first result and second [0] ante the most confidence version of that result ani .... ee .transcript ah result lo unna actual text ni istundhi...

          setQuestion(transcript)

        }

        recognition.onerror=(event)=>{
          console.error('Voice error: ',event.error)
          setQuestion('')
          alert('Voice input failed. Please try again.')
        }

        recognition.onend=()=>{
          console.log('Voice recognition ended.')
  
        }
       }
       const handleIpcSearch=()=>{
        if(!ipcQuery.trim())  return
        try{
          const response=await api.get(`/legal/ipc-search?query=${ipcQuery}`)
          setIpcResults(response.data.results)

        }catch(err){
          setIpcResults([])
        }
       }
    
    return(
        <div style={{
            height:'100vh',
            display:'flex',
            flexDirection:'column',
            backgroundColor: '#0f172a',
            fontFamily: 'sans-serif',            
        }}>


            {/* HEADER */}
         <div style={{
            padding:'1rem 2rem',
            backgroundColor:'#1E293B',
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center',
            borderBottom:'1px solid #334155'
         }}> 
         <h2 style={{
            color:'#f8fafc',
            margin:0
         }}>⚖️ CourtroomAI </h2>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {['en', 'hi', 'te'].map(lang => (
              <button
                key={lang}
                onClick={() => i18n.changeLanguage(lang)}
                style={{
                  padding: '0.3rem 0.7rem',
                  backgroundColor: i18n.language === lang ? '#6366f1' : '#334155',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: i18n.language === lang ? 'bold' : 'normal'
         }}
       >
          {lang === 'en' ? 'EN' : lang === 'hi' ? 'हि' : 'తె'}
        </button>
     ))}

     <button 
         onClick={()=> setShowIpcSearch(!showIpcSearch)}
         style={{
          padding:'0.5 rem 1 rem',
          backgroundColor:'#0ea5e9',
          color:'white',
          border:'none',
          borderRadius:'8px',
          cursor:'pointer',
          fontSize:'0.8rem',
          fontWeight:'bold'
         }}
         >
          🔍 IPC Search
         </button>
   </div>
            <button onClick={handleLogout} style={{
                padding:'0.5rem 1rem',
                backgroundColor:'#ef4444',
                color:'#f8fafc',
                border:'none',
                borderRadius:'8px',
                cursor:'pointer',
                fontSize:'0.875rem'
            }}> 
                {t('logout')}
            </button>
          {showIpcSearch && (
    <div style={{
        padding: '1rem 1.5rem',
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155'
    }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
                value={ipcQuery}
                onChange={(e) => setIpcQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleIpcSearch()}
                placeholder="Search IPC section (e.g. 420)"
                style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    backgroundColor: '#0f172a',
                    color: '#f8fafc',
                    fontSize: '0.9rem'
                }}
            />
            <button
                onClick={handleIpcSearch}
                style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#0ea5e9',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
              🔍 IPC Search
            </button>
        </div>
        {ipcResults.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {ipcResults.map((result, i) => (
                    <div key={i} style={{
                        padding: '0.75rem',
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        color: '#cbd5e1',
                        fontSize: '0.85rem'
                    }}>
                        {result}
                    </div>
                ))}
            </div>
        )}
    </div>
)}
         </div> 
            {/* messages AREA */}
            <div style={{
                flex:1,
                overflowY:'auto',
                padding:'1.5rem',
                display:'flex',
                flexDirection:'column',
                gap:'1rem'
            }}>
                {messages.map((msg, index) => (
  <div
    key={index}
    style={{
      display: 'flex',
      justifyContent:
        msg.sender === 'user'
          ? 'flex-end'
          : 'flex-start'
    }}
  >
    
    <div
      style={{
        display: 'flex',
        gap: '10px',
        flexDirection:
          msg.sender === 'user'
            ? 'row-reverse'
            : 'row',
        alignItems: 'center'
      }}
    >
      {/* Avatar */}

      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border:'1px solid #334155',
          backgroundColor:
            "transparent",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {msg.sender === 'user' ? '🧑‍⚖️' : '⚖️'}
      </div>

      {/* Message Bubble */}

      <div
        style={{
          maxWidth: '65%',
          padding: '1rem',
          borderRadius:
            msg.sender === 'user'
              ? '18px 18px 4px 18px'
              : '18px 18px 18px 4px',
          backgroundColor:
            msg.sender === 'user'
              ? '#6366f1'
              : '#1E293B',
          color: '#f8fafc',
          whiteSpace: 'pre-wrap'
        }}
      >
        {msg.sender === 'ai' && (
          <div
            style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              marginBottom: '0.5rem'
            }}
          >
            CourtroomAI
          </div>
        )}

        <ReactMarkdown>
          {msg.text}
        </ReactMarkdown>
      </div>
    </div>
  </div>
))}
                {/* LOADING INDICATOR */}

                {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '1rem',
              borderRadius: '18px 18px 18px 4px',
              backgroundColor: '#1E293B',
              color: '#94a3b8',
              fontSize: '0.95rem'
            }}>
              ⚖️ {t('thinking')}...
            </div>
          </div>
)}



        {/* INVISIBLE DIV AT BOTTOM FOR AUTO SCROLL */}

        <div ref={bottomRef} />
             </div>

            {/* INPUT AREA */}
            <div style={{
                padding:'1rem 1.5rem',
                backgroundColor:'#1e293b',
                borderTop:'1px solid #334155',
                display:'flex',
                gap:'0.75rem',
                alignItems:'flex-end'
            }}>
                <textarea
                value={question}
                onChange={(e)=>setQuestion(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={t('placeholder')}
                rows={2}
                style={{
                    flex:1,
                    padding:'0.75rem',
                    border:'1px solid #334155',
                    borderRadius:'12px',
                    backgroundColor:'#0f172a',
                    color:'#f8fafc',
                    fontSize:'0.95rem',
                    resize:'none',
                    fontFamily:'sans-serif',
                    lineHeight:'1.5'
                }}
                />

                <button onClick={
                  handleVoiceInput
                }
                style={{
                  padding:'0.75rem',
                  backgroundColor:'#334155',
                  color:'white',
                  border:'none',
                  borderRadius:'12px',
                  cursor:'pointer',
                  fontSize:'1.2rem',
                  whiteSpace:'nowrap'
                }}
                >
                  🎤
                </button>

                <button onClick={handleSend}
                disabled={loading || !question.trim()} 
                style={{
                    padding:'0.75rem 1.5rem',
                    backgroundColor: loading || !question.trim() ? '#334155' : '#6366f1',
                    color:'#f8fafc',
                    border:'none',
                    borderRadius:'12px',
                    cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                }}>

                {loading ? '...' : `${t('send')} ➤`}
                </button>
                <button
                    onClick={handleGenerateNotice}
                    disabled={loading || !question.trim()}
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: loading || !question.trim() ? '#334155' : '#10b981',
    // green button for notice generator
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                   }}
                >
                  📄 {t('notice')}
                </button>
            </div>
        </div>
    )
}



export default Chat