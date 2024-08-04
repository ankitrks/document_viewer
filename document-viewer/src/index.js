import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import DocumentViewer from './DocumentViewer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

ReactDOM.render(
  <DndProvider backend={HTML5Backend}>
    <DocumentViewer />
  </DndProvider>,
  document.getElementById('root')
);
