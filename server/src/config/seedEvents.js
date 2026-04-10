// server/src/config/seedEvents.js
require('dotenv').config({ path: '../../.env' });
const pool = require('./db');

const events = [
  {
    event_name: 'Hackatron 2026',
    description: 'The annual 48-hour hackathon. Build innovative solutions and win huge prizes!',
    long_description: 'Join us for Hackatron 2026! This 48-hour coding marathon brings together the best minds to solve real-world problems. Free food, swag, and massive cash prizes for the top 3 teams.',
    event_date: '2026-10-15 09:00:00',
    end_date: '2026-10-17 09:00:00',
    location: 'Main Academic Block',
    capacity: 150,
    club_id: 1, // Assuming ID 1 is the Technical Club
    category: 'Technical',
    status: 'upcoming',
    visitor_open: 1,
    team_size: '3-4 members',
    prizes: JSON.stringify({ 1: '₹15,000', 2: '₹10,000', 3: '₹5,000' })
  },
  {
    event_name: 'Kreeda 2026 - Inter-branch Sports',
    description: 'Annual sports meet featuring cricket, football, basketball, and more.',
    long_description: 'Represent your branch in Kreeda 2026! Competitions will be held across various sports including Cricket, Football, Basketball, Table Tennis, and Badminton. May the best branch win the overall trophy!',
    event_date: '2026-11-05 08:00:00',
    end_date: '2026-11-10 18:00:00',
    location: 'Institute Sports Ground',
    capacity: 300,
    club_id: 3, // Assuming ID 3 is the Sports Club
    category: 'Sports',
    status: 'upcoming',
    visitor_open: 0,
    team_size: 'Varies by sport',
    prizes: JSON.stringify({ 1: 'Trophy + Medals', 2: 'Medals' })
  },
  {
    event_name: 'Alfaaz - Open Mic Night',
    description: 'An evening of poetry, storytelling, and musical performances.',
    long_description: 'Express yourself at Alfaaz, our signature Open Mic night. Whether you write poetry, sing, or perform stand-up comedy, the stage is yours. Limited performance slots available, but infinite seating for the audience.',
    event_date: '2026-09-20 19:00:00',
    end_date: '2026-09-20 22:00:00',
    location: 'Open Air Theatre (OAT)',
    capacity: 200,
    club_id: 4, // Assuming ID 4 is the Literary Club
    category: 'Literary',
    status: 'registration_open',
    visitor_open: 1,
    team_size: 'Individual',
    prizes: JSON.stringify({ participation: 'Certificates for all performers' })
  },
  {
    event_name: 'Rhythm - Dance Fest',
    description: 'Inter-college group and solo dance competition.',
    long_description: 'Get ready to groove at Rhythm! Show off your moves in our solo, duet, and group dance categories. We are expecting participation from colleges across the city.',
    event_date: '2026-10-25 18:00:00',
    end_date: '2026-10-25 23:00:00',
    location: 'Main Auditorium',
    capacity: 500,
    club_id: 2, // Assuming ID 2 is the Cultural Club
    category: 'Cultural',
    status: 'upcoming',
    visitor_open: 1,
    team_size: '1-15 members',
    prizes: JSON.stringify({ 1: '₹10,000', 2: '₹5,000' })
  }
];

async function seedEvents() {
  try {
    console.log('⏳ Seeding events...');
    for (const e of events) {
      await pool.query(
        `INSERT INTO events (
          event_name, description, long_description, event_date, end_date, 
          location, capacity, club_id, category, status, visitor_open, 
          team_size, prizes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          e.event_name, e.description, e.long_description, e.event_date, e.end_date,
          e.location, e.capacity, e.club_id, e.category, e.status, e.visitor_open,
          e.team_size, e.prizes
        ]
      );
    }
    console.log('✅ Successfully seeded events!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
}

seedEvents();