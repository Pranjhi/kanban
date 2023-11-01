import React, { useEffect, useState } from 'react';
import './App.css';
import Card from './card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faUser, faList, faFlag, faSortAlphaUp, faSortAlphaDown } from '@fortawesome/free-solid-svg-icons';
function KanbanBoard() {
  const [tickets, setTickets] = useState([]);
  const [grouping, setGrouping] = useState('user');
  const [sorting, setSorting] = useState('priority');

  useEffect(() => {
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then((response) => response.json())
      .then((data) => setTickets(data.tickets)); 
  }, []);

  const groupTickets = (tickets) => {
    if (grouping === 'user') {
      const grouped = {};
  
      tickets.forEach((ticket) => {
        const user = ticket.user || 'Unassigned';
        if (!grouped[user]) {
          grouped[user] = [];
        }
        grouped[user].push(ticket);
      });
  
      return Object.entries(grouped).map(([name, tickets]) => ({
        name,
        tickets,
      }));
    } else if (grouping === 'status') {
      const grouped = {};
  
      tickets.forEach((ticket) => {
        const status = ticket.status || 'Unassigned';
        if (!grouped[status]) {
          grouped[status] = [];
        }
        grouped[status].push(ticket);
      });
  
      return Object.entries(grouped).map(([name, tickets]) => ({
        name,
        tickets,
      }));
    } else if (grouping === 'priority') {
      const priorityGroups = {
        4: 'Urgent',
        3: 'High',
        2: 'Medium',
        1: 'Low',
        0: 'No priority',
      };
  
      const grouped = {};
  
      tickets.forEach((ticket) => {
        const priority = ticket.priority;
        const groupName = priorityGroups[priority] || 'No priority';
  
        if (!grouped[groupName]) {
          grouped[groupName] = [];
        }
        grouped[groupName].push(ticket);
      });
  
      return Object.entries(grouped).map(([name, tickets]) => ({
        name,
        tickets,
      }));
    }
  
    return [];
  };
  
  const sortTickets = (tickets) => {
    return [...tickets].sort((a, b) => {
      if (sorting === 'priority') {
        return b.priority - a.priority;
      } else if (sorting === 'title') {
        if (a.title && b.title) {
          return a.title.localeCompare(b.title);
        } else {
          return 0; 
        }
      } else if (sorting === 'due-date') {
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (!a.dueDate && b.dueDate) {
          return 1; 
        } else if (a.dueDate && !b.dueDate) {
          return -1; 
        } else {
          return 0; 
        }
      } else if (sorting === 'created-date') {
        if (a.createdDate && b.createdDate) {
          return new Date(a.createdDate) - new Date(b.createdDate);
        } else if (!a.createdDate && b.createdDate) {
          return 1; 
        } else if (a.createdDate && !b.createdDate) {
          return -1; 
        } else {
          return 0; 
        }
      }
      return 0;
    });
  };
  const groupedAndSortedTickets = sortTickets(groupTickets(tickets));

  const [isDisplayed, setDisplay] = useState(false);

  return (
    <div className="kanban-board">
    <div className="header">
      <div className="controls">
      <button className='display' onClick={() => setDisplay(!isDisplayed)}>
  <FontAwesomeIcon icon={isDisplayed ? faCaretUp : faCaretDown} /> Display
</button>
        {isDisplayed && (
          <span>
            <span><FontAwesomeIcon icon={faList} /> Grouping:</span>
            <select
              className="select"
              value={grouping}
              onChange={(e) => setGrouping(e.target.value)}
            >
              <option value="user"><FontAwesomeIcon icon={faUser} /> User</option>
              <option value="status"><FontAwesomeIcon icon={faFlag} /> Status</option>
              <option value="priority"><FontAwesomeIcon icon={faSortAlphaUp} /> Priority</option>
            </select><br></br>
            <span><FontAwesomeIcon icon={faSortAlphaDown} /> Ordering:</span>
            <select
              className="select"
              value={sorting}
              onChange={(e) => setSorting(e.target.value)}
            >
              <option value="priority"><FontAwesomeIcon icon={faSortAlphaUp} /> Priority</option>
              <option value="title"><FontAwesomeIcon icon={faSortAlphaDown} /> Title</option>
            </select>
          </span>
        )}
      </div>
      </div>
      <div className="columns">
        {groupedAndSortedTickets.map((column) => (
          <div className="column" key={column.name}>
            <h2>{column.name}</h2>
            {column.tickets.map((ticket) => (
              <Card key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export default KanbanBoard;