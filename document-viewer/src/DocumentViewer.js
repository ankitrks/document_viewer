import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DocumentViewer.css';
import Card from './Card';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const DocumentViewer = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/documents');
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedDocuments = Array.from(documents);
    const [movedDocument] = reorderedDocuments.splice(result.source.index, 1);
    reorderedDocuments.splice(result.destination.index, 0, movedDocument);

    setDocuments(reorderedDocuments);

    for (let i = 0; i < reorderedDocuments.length; i++) {
      reorderedDocuments[i].position = i;
      await axios.put(`http://localhost:8080/documents/${reorderedDocuments[i].id}`, reorderedDocuments[i]);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="documents" direction="horizontal">
        {(provided) => (
          <div className="document-viewer" {...provided.droppableProps} ref={provided.innerRef}>
            {documents.map((doc, index) => (
              <Draggable key={doc.id} draggableId={doc.id.toString()} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <Card type={doc.type} title={doc.title} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DocumentViewer;
