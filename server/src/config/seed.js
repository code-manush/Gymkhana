const pool = require('./db');

async function seedClubs() {
  const clubsData = `
    INSERT INTO clubs (club_name, description, long_description, category, founded, is_active) 
    VALUES 
    ('Coders Club', 'A club for programming enthusiasts.', 'We organize hackathons, coding workshops, and peer-to-peer learning sessions.', 'Technical', 2020, 1),
    ('Drama Society', 'Express yourself on stage.', 'The Drama Society produces biannual plays and hosts weekly improv sessions.', 'Cultural', 2018, 1),
    ('Athletics Club', 'For track and field lovers.', 'Join us for morning runs, inter-college tournaments, and fitness camps.', 'Sports', 2015, 1),
    ('Debate Team', 'Master the art of argument.', 'We participate in national parliamentary debates and host weekly discussion forums.', 'Literary', 2019, 1)
  `;

  try {
    console.log('⏳ Seeding clubs data...');
    const [result] = await pool.query(clubsData);
    console.log(`✅ Successfully added ${result.affectedRows} clubs to the database!`);
  } catch (err) {
    console.error('❌ Failed to seed clubs:', err.message);
  } finally {
    process.exit(0); 
  }
}

seedClubs();