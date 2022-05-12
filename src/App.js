import React, { useRef, useState } from 'react';

import image from './assets/lplogosmall.png';
import './App.css';
import './script'; 
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDkVmKB5uIvmCBGrJAtm4ZEj3YcqbsrS2Y",
  authDomain: "project-9198236804677899220.firebaseapp.com",
  databaseURL: "https://project-9198236804677899220-default-rtdb.firebaseio.com",
  projectId: "project-9198236804677899220",
  storageBucket: "project-9198236804677899220.appspot.com",
  messagingSenderId: "139383036465",
  appId: "1:139383036465:web:5c7a6a00c25e21fd3ed310",
  measurementId: "G-94SHEQ6FCY"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom/> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.TwitterAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <div className='signIn'>
      <button onClick={signInWithGoogle}>Sign in</button>
      <h3>Welcome to the party</h3>
    </div>
  )
}



function SignOut() {
  return auth.currentUser && (

    <div className='row row-12'>
            <div className='col-lg-12 col-md-12 col-sm-12'>
                <div className='container header-container'>
                <div className='header-items'>
                  <img alt='logo' src={image} height={45} width={75}></img>
                  <h1 className='title'>Listening Party</h1>
                  <button onClick={() => auth.signOut()}>Sign Out</button>
                </div>
          </div>
      </div>
    </div>
  )
}





function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(10000);

  const [messages] = useCollectionData(query, { idField: 'id' });
  
  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div>
      <div className='row'>
        <div className='col-lg-9 col-md-9 col-sm-9'>
            <div id="visual"  className='container visualizer-container'>
           
           <visual></visual>
            <div class="loader"></div>
    <audio id="audio" crossOrigin="anonymous"></audio>
            <div class="controls">
            <button class="play">
                <svg version="1.1" width="32" height="32" viewBox="0 0 25 32"
                    data-tags="play,media control">
                    <g fill="#fff" transform="scale(0.03125 0.03125)">
                        <path d="M192 0v1024l640-511.264-640-512.736z" />
                    </g>
                </svg>
            </button>
            <button class="pause">
                <svg width="32" height="32" viewBox="0 0 32 32"
                    data-tags="pause,media control">
                    <g fill="#fff" transform="scale(0.03125 0.03125)">
                        <path d="M352 0h-192c-17.696 0-32 14.336-32 32v960c0 17.696 14.304 32 32 32h192c17.696 0 32-14.304 32-32v-960c0-17.664-14.304-32-32-32zM864 0h-192c-17.696 0-32 14.336-32 32v960c0 17.696 14.304 32 32 32h192c17.696 0 32-14.304 32-32v-960c0-17.664-14.304-32-32-32z"
                        />
                    </g>
                </svg>
            </button>
           
        </div>
             
                        
            </div>
          </div>
       
    <div class="loader"></div>
    <audio id="audio" crossOrigin="anonymous"></audio>
          
        <div className='col-lg-3 col-md-3 col-sm-3'>
          <div className='container chat-container'>

          

              <main>

              {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

              <div ref={dummy}></div>
  
              </main>

            
            <div className='container-fluid'>
              <div className='row'>
                <div className='col-12'>
                  <form className='submit' onSubmit={sendMessage}>
                         
                        
                  <input
                  onChange={(e) => setFormValue(e.target.value)}
                  />
                  <button type="submit" disabled={!formValue}></button>
                              
                              
                  </form>
                </div>
              </div>
            </div>
          </div>

                     
        </div>
      </div>
  </div>
)};



function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  // if equal, then we know the current user sent the message
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';


  return (
    <div className={`mesage ${messageClass}`}>
      <img alt='user' src={photoURL} />
      <div className='container'>
        <div className='row'>
          <div className='col'>
            <p>{uid}<br />{text}</p>
            <div className='timestamp'></div>
          </div>
        </div>
      </div>
    </div>
  )
}



export default App;
