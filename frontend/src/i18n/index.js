// This file is our translation dictionary ante anni languages yokka details..which we are including in our proj

import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'

// i18next mana core lib...react-i18next connects us to React specificallyy

i18n.use(initReactI18next).init({
  // .use(initReactI18next) plugs React support into i18next
  // .init() starts the library with our configuration

  resources:{
    en:{
        translation:{
            // english ki
            appName:'CourtroomAI',
            tagline:'Legal aid for every Indian',
            login:'Login',
            signup:'Sign Up',
            email:'Email',
            password:'Password',
            fullName:'Full Name',
            pleaseWait:'Please Wait...',
            createAccount:'Create Account',
            placeholder: 'Describe your legal problem...(Press Enter to send)',
            send: 'Send',
            notice: 'Notice',
            logout: 'Logout',
            thinking: 'CourtroomAI is thinking...',
            noticeSuccess: '📄 Your legal notice has been generated and downloaded!',
            error: 'Sorry, something went wrong. Please try again.'

        }
    },

    hi:{
        translation:{
        // hindi ki
        appName: 'कोर्टरूम AI',
        tagline: 'हर भारतीय के लिए कानूनी सहायता',
        login: 'लॉगिन',
        signup: 'साइन अप',
        email: 'ईमेल',
        password: 'पासवर्ड',
        fullName: 'पूरा नाम',
        pleaseWait: 'कृपया प्रतीक्षा करें...',
        createAccount: 'खाता बनाएं',
        placeholder: 'अपनी कानूनी समस्या बताएं...',
        send: 'भेजें',
        notice: 'नोटिस',
        logout: 'लॉगआउट',
        thinking: 'CourtroomAI सोच रहा है...',
        noticeSuccess: '📄 आपका कानूनी नोटिस तैयार हो गया है!',
        error: 'क्षमा करें, कुछ गलत हो गया। पुनः प्रयास करें।'
        }
    },
  
    te:{
        translation:{
        // telugu ki
        appName: 'కోర్ట్‌రూమ్ AI',
        tagline: 'ప్రతి భారతీయుడికి న్యాయ సహాయం',
        login: 'లాగిన్',
        signup: 'సైన్ అప్',
        email: 'ఇమెయిల్',
        password: 'పాస్‌వర్డ్',
        fullName: 'పూర్తి పేరు',
        pleaseWait: 'దయచేసి వేచి ఉండండి...',
        createAccount: 'ఖాతా సృష్టించండి',
        placeholder: 'మీ చట్టపరమైన సమస్యను వివరించండి...',
        send: 'పంపు',
        notice: 'నోటీసు',
        logout: 'లాగౌట్',
        thinking: 'CourtroomAI ఆలోచిస్తోంది...',
        noticeSuccess: '📄 మీ చట్టపరమైన నోటీసు డౌన్‌లోడ్ అయింది!',
        error: 'క్షమించండి, ఏదో తప్పు జరిగింది. మళ్లీ ప్రయత్నించండి.'

        }
    }
},
lng:'en',
// default manam english tho start chestam..
fallbackLng:'en',
// okavela tel or hin select chesinappudu emaina word rakapote aa lang lo..we put it in eng
interpolation:{
    escapeValue:false
    // ila fasle ani enduku ante already react protects from this XSS..(nee notes chudu)..so double escaping avthadi okavela idi true aithe..ugly uncoded text aipotundi..so false pedtam

}
})

export default i18n

