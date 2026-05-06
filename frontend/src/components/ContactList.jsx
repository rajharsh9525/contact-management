import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://contact-management-hlu5.onrender.com/contact/view-contacts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContacts(response.data.data);
      } catch (error) {
        setError('Failed to fetch contacts');
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading your contacts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="nav">
        <Link to="/add-contact" className="btn btn-secondary">Add New Contact</Link>
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'white' }}>Your Contacts</h2>

      {contacts.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#718096' }}>No contacts found. <Link to="/add-contact" className="link">Add your first contact</Link></p>
        </div>
      ) : (
        <div className="contact-grid">
          {contacts.map(contact => (
            <div key={contact._id} className="contact-card">
              <img src={contact.imageUrl} alt={contact.fullName} className="contact-image" />
              <div className="contact-info">
                <h3>{contact.fullName}</h3>
                <p><strong>Email:</strong> {contact.email}</p>
                <p><strong>Phone:</strong> {contact.phone}</p>
                <p><strong>Gender:</strong> {contact.gender}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList;