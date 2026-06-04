// This is the login and signup page

import {useState} from 'react'

import {useNavigate} from 'react-router-dom'

import api from '../api/axios'

function Login(){
    const navigate=useNavigate()
     // useNavigate() gives us the navigate function
     // we call navigate('/chat') after successful login 

    const[isLogin,setLogin]=useState(true)
    const[username, setUsername]=useState('')
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
                    ⚖️ CourtroomAI
                </h1>
                <p style={{ color:'#94a3b8', textAlign:'center', marginBottom:'2rem' }}>
                    Legal aid for every Indian 
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
                        Login
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
                        Sign Up
                    </button>
                </div>
                {!isLogin && (
                    <div style={{ marginBottom:'1rem' }}>
                        <input
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
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
                {/* Email FIELD */}

                <div style={{ marginBottom:'1rem' }}>
                    <input
                    type='email'
                    placeholder='Email'
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
                {/* PASSWORD FIELD */}

                <div style={{ marginBottom:'1rem' }}>
                    <input
                    type='password'
                    placeholder='Password'
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

                {/* SUBMIT BUTTON */}

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
                    {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
                </button>
            </div>
        </div>
    )
}


export default Login
