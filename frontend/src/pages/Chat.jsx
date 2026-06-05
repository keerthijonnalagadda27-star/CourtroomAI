// This is the main chat interface of CourtroomAI


import {useState, useEffect, useRef} from 'react'

// useState — store messages, current question, loading state
// useEffect — runs code when page first loads
// useRef — used to auto-scroll to bottom when new message arrives

import {useNavigate} from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

import api from '../api/axios'

function Chat(){
    const navigate=useNavigate()
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
            <button onClick={handleLogout} style={{
                padding:'0.5rem 1rem',
                backgroundColor:'#ef4444',
                color:'#f8fafc',
                border:'none',
                borderRadius:'8px',
                cursor:'pointer',
                fontSize:'0.875rem'
            }}> 
                Logout
            </button>
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
              ⚖️ CourtroomAI is thinking...
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
                placeholder='Describe your legal problem...(Press Enter to send)'
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

                {loading ? '...' : 'Send ➤ '}
                </button>
            </div>
        </div>
    )
}



export default Chat