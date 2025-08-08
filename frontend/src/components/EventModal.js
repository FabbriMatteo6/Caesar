import React from 'react';
import axios from 'axios';
import './EventModal.css'; // We'll need to create this for basic styling

const EventModal = ({ event, onResolve }) => {
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleChoice = async (choiceId) => {
    try {
      const response = await axios.post('/api/actions/handle_event', { choiceId }, { headers: getAuthHeader() });
      onResolve(response.data); // Pass the new game state back to the parent
    } catch (error) {
      console.error("Failed to handle event choice", error);
      // Optionally, display an error message to the user within the modal
    }
  };

  if (!event || !event.event_name) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{event.event_name}</h2>
        <p>{event.event_description}</p>
        <div className="modal-choices">
          {event.event_choices && event.event_choices.map(choice => (
            <button key={choice.choice_id} onClick={() => handleChoice(choice.choice_id)}>
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
