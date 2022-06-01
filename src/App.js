import React from 'react'

import logo from './logo.svg';
import './App.css';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import ListTranscribesComponent from './component/ListTranscribesComponent'
import TranscribeComponent from './component/TranscribeComponent'
import MenuComponent from './component/MenuComponent';

const transcribeListRef = React.createRef();  
function App() {
  
  const refreshCallback = e => {
    transcribeListRef.current.refreshTranscribes()
  };

  return (
    <Authenticator>
    {({ signOut, user }) => (
      <div className='container'>
        <MenuComponent  signOut={signOut} user={user} />
        <TranscribeComponent
            refreshCallback={refreshCallback}
        />
        <ListTranscribesComponent 
          ref={transcribeListRef} 
        />
      </div>
    )}
  </Authenticator>

  );
}


export default App;
