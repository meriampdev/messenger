import React from 'react';
import './search.css';

export default function Search() {
    return (
      <div className="conversation-search">
        <input
          type="search"
          className="conversation-search-input"
          placeholder="Search Messenger"
        />
      </div>
    );
}