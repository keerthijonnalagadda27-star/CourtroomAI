// This is the login and signup page

import {useState} from 'react'

import {useNavigate} from 'react-router-dom'

import api from '../api/axios'

import { useTranslation } from 'react-i18next'
import i18n from '../i18n/index.js'

function Login(){
    const navigate=useNavigate()
     // useNavigate() gives us the navigate function
     // we call navigate('/chat') after successful login 
     const {t} =useTranslation()
     // t is the translation function
     // t('login') returns "Login" in English, "लॉगिन" in Hindi etc

    const[isLogin,setLogin]=useState(true)
    const[fullName, setFullName]=useState('')
    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
    const[error,setError]=useState('')
    const[loading,setLoading]=useState(false)
    // loading tracks if we're waiting for the API response
    // false = not loading, true = waiting

    const handleSubmit =async()=>{
        setError('')
        setLoading(true)
        // show loading state on button
        try{
            if(isLogin){
                const response=await api.post('/auth/login',{
                    email:email,
                    password:password
                })
                localStorage.setItem('token',response.data.access_token)

                window.location.href='/chat'
        
            }else{
                await api.post('/auth/signup',{
                    full_name:fullName,
                    email:email,
                    password:password
                })

                const response=await api.post('/auth/login',{
                    email:email,
                    password:password
                })
                localStorage.setItem('token',response.data.access_token)
                window.location.href='/chat'

            }

        }
        catch(err){
            setError(err.response?.data?.detail ||"Something went wrong")

        }
        setLoading(false)
        // whether success or failure — stop loading state

    }
    return(
    <>
    
    <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 999
    }}>
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
    </div>

    {/* MAIN LOGIN CARD */}
    <div style={{
        minHeight:'100vh',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#0f172a',
        fontFamily:'sans-serif'
    }}>
        <div style={{
            backgroundColor:'#1e293b',
            padding:'2rem',
            borderRadius:'12px',
            width:'100%',
            maxWidth:'400px',
            boxShadow:'0 4px 24px rgba(0,0,0,0.4)'
        }}>
            <h1 style={{ color:'#f8fafc', textAlign:'center', marginBottom:'0.5rem' }}>
                ⚖️ {t('appName')}
            </h1>
            <p style={{ color:'#94a3b8', textAlign:'center', marginBottom:'2rem' }}>
                {t('tagline')}
            </p>
            <div style={{
                display:'flex',
                marginBottom:'1.5rem',
                borderRadius:'8px',
                overflow:'hidden'}}>
                <button 
                    onClick={()=>setLogin(true)}
                    style={{
                        flex:1,
                        padding:'0.75rem',
                        border:'none',
                        cursor:'pointer',
                        backgroundColor:isLogin?'#6366f1':'#334155',
                        color:'#f8fafc',
                        fontWeight:isLogin?'bold':'normal'
                    }}
                >
                    {t('login')}
                </button>
                <button
                    onClick={()=>setLogin(false)}
                    style={{
                        flex:1,
                        padding:'0.75rem',
                        border:'none',
                        cursor:'pointer',
                        backgroundColor:!isLogin?'#6366f1':'#334155',
                        color:'#f8fafc',
                        fontWeight:!isLogin?'bold':'normal'
                    }}
                >
                    {t('signup')}
                </button>
            </div>
              {/* email field */}
            {!isLogin && (
                <div style={{ marginBottom:'1rem' }}>
                    <input
                        type='text'
                        placeholder={t('fullName')}
                        value={fullName}
                        onChange={(e)=>setFullName(e.target.value)}
                        style={{
                            width:'100%',
                            padding:'0.75rem',
                            borderRadius:'8px',
                            border:'1px solid #334155',
                            backgroundColor:'#0f172a',
                            color:'#f8fafc',
                            fontSize:'1rem',
                            boxSizing:'border-box'
                        }}
                    />
                </div>
            )}

            <div style={{ marginBottom:'1rem' }}>
                <input
                    type='email'
                    placeholder={t('email')}
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    style={{
                        width:'100%',
                        padding:'0.75rem',
                        borderRadius:'8px',
                        border:'1px solid #334155',
                        backgroundColor:'#0f172a',
                        color:'#f8fafc',
                        fontSize:'1rem',
                        boxSizing:'border-box'
                    }}
                />
            </div>
                   {/* password field */}
            <div style={{ marginBottom:'1rem' }}>
                <input
                    type='password'
                    placeholder={t('password')}
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    style={{
                        width:'100%',
                        padding:'0.75rem',
                        borderRadius:'8px', 
                        border:'1px solid #334155',
                        backgroundColor:'#0f172a',
                        color:'#f8fafc',
                        fontSize:'1rem',
                        boxSizing:'border-box'
                    }}
                />
            </div>

            {error && (
                <p style={{ color:'#f87171', marginBottom:'1rem', textAlign:'center' }}>
                    {error}
                </p>
            )}
                   {/* submit button */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                    width:'100%',
                    padding:'0.75rem',
                    border:'none',
                    borderRadius:'8px',
                    backgroundColor:loading ? '#4338ca' : '#6366f1',
                    color:'#f8fafc',
                    fontSize:'1rem',
                    fontWeight:'bold',
                    cursor:loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? t('pleaseWait') : (isLogin ? t('login') : t('createAccount'))}
            </button>
        </div>
    </div>
    </>
)
}


export default Login
