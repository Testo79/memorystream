import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';

const db = new sqlite3.Database('./memorystream.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize database schema
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create places table
      db.run(`
        CREATE TABLE IF NOT EXISTS places (
          id TEXT PRIMARY KEY,
          name TEXT,
          lat REAL NOT NULL,
          lng REAL NOT NULL
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Create stories table
      db.run(`
        CREATE TABLE IF NOT EXISTS stories (
          id TEXT PRIMARY KEY,
          placeId TEXT NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          FOREIGN KEY (placeId) REFERENCES places(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Check if database is empty and seed if needed
      db.get('SELECT COUNT(*) as count FROM places', (err, row) => {
        if (err) {
          reject(err);
        } else if (row.count === 0) {
          console.log('📦 Database is empty. Generating seed data...');
          seedDatabase()
            .then(() => {
              console.log('✅ Seed data generated successfully');
              resolve();
            })
            .catch(reject);
        } else {
          console.log(`✅ Database already contains ${row.count} places. Skipping seed.`);
          resolve();
        }
      });
    });
  });
};

// Generate random story content
const generateRandomStory = (placeName, cityName) => {
  const storyTemplates = [
    {
      title: `Première visite à ${placeName}`,
      content: `Ma première fois ici, c'était il y a quelques années. ${placeName} m'a immédiatement marqué par son atmosphère unique. Je me souviens de chaque détail comme si c'était hier.`
    },
    {
      title: `Un moment inoubliable`,
      content: `J'ai vécu un moment magique ici à ${placeName}. L'ambiance était parfaite, les gens souriaient, et j'ai senti que j'étais exactement où je devais être. ${cityName} a vraiment quelque chose de spécial.`
    },
    {
      title: `Rencontre fortuite`,
      content: `C'est ici que j'ai rencontré quelqu'un qui a changé ma perspective. ${placeName} est devenu un lieu symbolique pour moi, un endroit où les hasards de la vie prennent tout leur sens.`
    },
    {
      title: `Souvenir d'enfance`,
      content: `Quand j'étais enfant, mes parents m'emmenaient souvent à ${placeName}. Ces souvenirs sont gravés dans ma mémoire. Revenir ici aujourd'hui me rappelle ces moments précieux.`
    },
    {
      title: `Découverte culturelle`,
      content: `J'ai découvert ici une facette de ${cityName} que je ne connaissais pas. ${placeName} révèle la richesse culturelle de cette ville. Une expérience enrichissante qui m'a ouvert les yeux.`
    },
    {
      title: `Moment de paix`,
      content: `Parfois, on a juste besoin d'un endroit calme pour réfléchir. ${placeName} est devenu mon refuge, mon lieu de ressourcement. Ici, le temps semble s'arrêter.`
    },
    {
      title: `Fête mémorable`,
      content: `Nous avons célébré quelque chose d'important ici. L'énergie de ${placeName} a rendu cette célébration encore plus spéciale. Les rires, les conversations, tout était parfait.`
    },
    {
      title: `Promenade matinale`,
      content: `Tôt le matin, ${placeName} prend une autre dimension. Le calme, la lumière douce, l'absence de foule... C'est à ce moment-là que j'aime le plus cet endroit.`
    },
    {
      title: `Histoire locale`,
      content: `Un habitant m'a raconté l'histoire de ${placeName}. Chaque pierre, chaque coin a son histoire. ${cityName} regorge de secrets et de légendes fascinantes.`
    },
    {
      title: `Retour après des années`,
      content: `Je suis revenu ici après plusieurs années d'absence. ${placeName} a changé, mais l'essence est restée la même. C'est comme retrouver un vieil ami.`
    }
  ];

  return storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
};

// Seed database with demo data (only if empty)
const seedDatabase = () => {
  return new Promise((resolve, reject) => {
    // Places across France - major cities and landmarks
    const places = [
      // Lille
      { id: uuidv4(), name: 'Grand Place', city: 'Lille', lat: 50.6367, lng: 3.0633 },
      { id: uuidv4(), name: 'Vieux-Lille', city: 'Lille', lat: 50.6412, lng: 3.0625 },
      { id: uuidv4(), name: 'Citadelle de Lille', city: 'Lille', lat: 50.6438, lng: 3.0447 },
      
      // Paris
      { id: uuidv4(), name: 'Tour Eiffel', city: 'Paris', lat: 48.8584, lng: 2.2945 },
      { id: uuidv4(), name: 'Notre-Dame de Paris', city: 'Paris', lat: 48.8530, lng: 2.3499 },
      { id: uuidv4(), name: 'Louvre', city: 'Paris', lat: 48.8606, lng: 2.3376 },
      { id: uuidv4(), name: 'Arc de Triomphe', city: 'Paris', lat: 48.8738, lng: 2.2950 },
      { id: uuidv4(), name: 'Montmartre', city: 'Paris', lat: 48.8867, lng: 2.3431 },
      { id: uuidv4(), name: 'Champs-Élysées', city: 'Paris', lat: 48.8698, lng: 2.3081 },
      
      // Lyon
      { id: uuidv4(), name: 'Vieux Lyon', city: 'Lyon', lat: 45.7634, lng: 4.8274 },
      { id: uuidv4(), name: 'Basilique Notre-Dame de Fourvière', city: 'Lyon', lat: 45.7622, lng: 4.8226 },
      { id: uuidv4(), name: 'Place Bellecour', city: 'Lyon', lat: 45.7578, lng: 4.8328 },
      { id: uuidv4(), name: 'Parc de la Tête d\'Or', city: 'Lyon', lat: 45.7772, lng: 4.8544 },
      
      // Marseille
      { id: uuidv4(), name: 'Vieux-Port', city: 'Marseille', lat: 43.2951, lng: 5.3740 },
      { id: uuidv4(), name: 'Notre-Dame de la Garde', city: 'Marseille', lat: 43.2842, lng: 5.3709 },
      { id: uuidv4(), name: 'Calanques de Marseille', city: 'Marseille', lat: 43.2108, lng: 5.3706 },
      { id: uuidv4(), name: 'Le Panier', city: 'Marseille', lat: 43.2975, lng: 5.3764 },
      
      // Bordeaux
      { id: uuidv4(), name: 'Place de la Bourse', city: 'Bordeaux', lat: 44.8378, lng: -0.5792 },
      { id: uuidv4(), name: 'Cathédrale Saint-André', city: 'Bordeaux', lat: 44.8376, lng: -0.5764 },
      { id: uuidv4(), name: 'Quai des Chartrons', city: 'Bordeaux', lat: 44.8500, lng: -0.5700 },
      { id: uuidv4(), name: 'Jardin Public', city: 'Bordeaux', lat: 44.8444, lng: -0.5800 },
      
      // Nice
      { id: uuidv4(), name: 'Promenade des Anglais', city: 'Nice', lat: 43.6950, lng: 7.2650 },
      { id: uuidv4(), name: 'Vieux Nice', city: 'Nice', lat: 43.6961, lng: 7.2756 },
      { id: uuidv4(), name: 'Colline du Château', city: 'Nice', lat: 43.6956, lng: 7.2794 },
      { id: uuidv4(), name: 'Marché aux Fleurs', city: 'Nice', lat: 43.6970, lng: 7.2725 },
      
      // Toulouse
      { id: uuidv4(), name: 'Capitole de Toulouse', city: 'Toulouse', lat: 43.6047, lng: 1.4442 },
      { id: uuidv4(), name: 'Basilique Saint-Sernin', city: 'Toulouse', lat: 43.6083, lng: 1.4431 },
      { id: uuidv4(), name: 'Canal du Midi', city: 'Toulouse', lat: 43.6100, lng: 1.4400 },
      
      // Strasbourg
      { id: uuidv4(), name: 'Cathédrale de Strasbourg', city: 'Strasbourg', lat: 48.5819, lng: 7.7508 },
      { id: uuidv4(), name: 'Petite France', city: 'Strasbourg', lat: 48.5800, lng: 7.7400 },
      { id: uuidv4(), name: 'Marché de Noël', city: 'Strasbourg', lat: 48.5833, lng: 7.7500 },
      
      // Nantes
      { id: uuidv4(), name: 'Château des Ducs de Bretagne', city: 'Nantes', lat: 47.2134, lng: -1.5500 },
      { id: uuidv4(), name: 'Île de Nantes', city: 'Nantes', lat: 47.2070, lng: -1.5500 },
      
      // Montpellier
      { id: uuidv4(), name: 'Place de la Comédie', city: 'Montpellier', lat: 43.6083, lng: 3.8769 },
      { id: uuidv4(), name: 'Arc de Triomphe', city: 'Montpellier', lat: 43.6100, lng: 3.8750 },
      
      // Rennes
      { id: uuidv4(), name: 'Place du Parlement', city: 'Rennes', lat: 48.1113, lng: -1.6800 },
      { id: uuidv4(), name: 'Parc du Thabor', city: 'Rennes', lat: 48.1144, lng: -1.6750 },
      
      // Reims
      { id: uuidv4(), name: 'Cathédrale de Reims', city: 'Reims', lat: 49.2538, lng: 4.0340 },
      
      // Dijon
      { id: uuidv4(), name: 'Palais des Ducs', city: 'Dijon', lat: 47.3220, lng: 5.0415 },
      
      // Grenoble
      { id: uuidv4(), name: 'Bastille de Grenoble', city: 'Grenoble', lat: 45.1956, lng: 5.7245 },
      
      // Aix-en-Provence
      { id: uuidv4(), name: 'Cours Mirabeau', city: 'Aix-en-Provence', lat: 43.5283, lng: 5.4497 },
      
      // Cannes
      { id: uuidv4(), name: 'Croisette', city: 'Cannes', lat: 43.5513, lng: 7.0128 },
      
      // Avignon
      { id: uuidv4(), name: 'Palais des Papes', city: 'Avignon', lat: 43.9516, lng: 4.8084 },
      
      // Annecy
      { id: uuidv4(), name: 'Lac d\'Annecy', city: 'Annecy', lat: 45.8992, lng: 6.1294 },
      
      // Colmar
      { id: uuidv4(), name: 'Petite Venise', city: 'Colmar', lat: 48.0767, lng: 7.3578 }
    ];

    // Insert places
    const insertPlace = db.prepare('INSERT INTO places (id, name, lat, lng) VALUES (?, ?, ?, ?)');
    places.forEach(place => {
      insertPlace.run(place.id, place.name, place.lat, place.lng);
    });
    insertPlace.finalize();

    // Insert stories - generate 2-5 random stories per place
    const insertStory = db.prepare('INSERT INTO stories (id, placeId, title, content, createdAt) VALUES (?, ?, ?, ?, ?)');
    
    let storyCount = 0;
    places.forEach(place => {
      const numStories = Math.floor(Math.random() * 4) + 2; // 2-5 stories per place
      for (let i = 0; i < numStories; i++) {
        const story = generateRandomStory(place.name, place.city);
        const storyId = uuidv4();
        // Generate realistic dates from the last 5 years
        const daysAgo = Math.floor(Math.random() * 1825); // 5 years
        const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
        
        insertStory.run(storyId, place.id, story.title, story.content, createdAt);
        storyCount++;
      }
    });
    
    insertStory.finalize((err) => {
      if (err) {
        reject(err);
      } else {
        console.log(`✅ Generated ${places.length} places and ${storyCount} stories`);
        resolve();
      }
    });
  });
};

// Export database and init function
export { db, initDatabase };
