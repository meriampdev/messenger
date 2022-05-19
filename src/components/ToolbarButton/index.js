import React from 'react';
import './toolbarButton.css';

export default function ToolbarButton(props) {
    const { icon } = props;
    return (
      <i className={`toolbar-button ${icon}`} />
    );
}