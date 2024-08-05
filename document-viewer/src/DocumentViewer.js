import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DocumentViewer.css';
import Card from './Card';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const DocumentViewer = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);  // State to track saving status

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
    setSaving(true);  // Start showing the loader

    // Simulate a save operation
    setTimeout(async () => {
      for (let i = 0; i < reorderedDocuments.length; i++) {
        reorderedDocuments[i].position = i;
        await axios.put(`http://localhost:8080/documents/${reorderedDocuments[i].id}`, reorderedDocuments[i]);
      }
      setSaving(false);  // Stop showing the loader once save is complete
      console.log('Documents saved!');
    }, 5000);  // Delay to mimic save operation
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {saving && <div className="loader">Saving changes...</div>}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="documents" direction="horizontal">
          {(provided) => (
            <div className="document-viewer" {...provided.droppableProps} ref={provided.innerRef}>
              {documents.map((doc, index) => (
                <Draggable key={doc.id} draggableId={doc.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="document-card"
                    >
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
    </>
  );
};

export default DocumentViewer;
