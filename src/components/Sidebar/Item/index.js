import React from 'react';
import './item.css';

export default function ConversationItem(props) {
  const { photo, name, text } = props.data;

  return (
    <div 
      onClick={props?.onClick}
      className={`conversation-list-item ${props.active ? 'active': ''}`}
    >
      <img className="conversation-photo" src={photo} alt="conversation" />
      <div className="conversation-info">
        <h1 className="conversation-title">{ name }</h1>
        <p className="conversation-snippet">{ text }</p>
      </div>
    </div>
  );
}