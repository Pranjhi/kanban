import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons'; 
function Card({ ticket }) {
  return (
    <div className="card">
      {ticket.status === 'Open' ? (
        <FontAwesomeIcon icon={faExclamationCircle} color="red" />
      ) : (
        <FontAwesomeIcon icon={faCheckCircle} color="green" />
      )}

      <h3>{ticket.title}</h3>
      <p>{ticket.description}</p>
    </div>
  );
}

export default Card;