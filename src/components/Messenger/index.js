import React from 'react';
import Sidebar from 'components/Sidebar';
import Conversation from 'components/Conversation';
import './messenger.css';

export default function Messenger(props) {

  return (
    <div className="messenger">
      <div className="scrollable sidebar">
        <Sidebar />
      </div>

      <div className="scrollable content">
        <Conversation />
      </div>
    </div>
  );
}