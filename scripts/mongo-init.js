db.createUser({
  user: 'root',
  pwd: 'example',
  roles: [
    {
      role: 'readWrite',
      db: 'corum',
    },
  ],
});
db.user.createIndex({ email: 1 }, { unique: true });

// admin user
db.user.insertOne({
  firstName: 'Admin',
  lastName: 'Admin',
  email: 'admin@example.com',
  password: '$2b$10$cvKytXMl6ByFwF0YFFs0RuB6VOiiF8ZCDVhdAts8QKxl9QzY/5yQK',
  birthdate: new Date('1990-01-01'),
});

const firstNames = [
  'James',
  'Mary',
  'John',
  'Patricia',
  'Robert',
  'Jennifer',
  'Michael',
  'Linda',
  'William',
  'Elizabeth',
];

const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Martinez',
  'Hernandez',
];

for (let i = 1; i < 100; i++) {
  const randomFirstName =
    firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName =
    lastNames[Math.floor(Math.random() * lastNames.length)];
  db.user.insertOne({
    firstName: randomFirstName,
    lastName: randomLastName,
    email: `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}${i}@example.com`,
    password: '$2b$10$cvKytXMl6ByFwF0YFFs0RuB6VOiiF8ZCDVhdAts8QKxl9QzY/5yQK',
    birthdate: new Date('1990-01-01'),
  });
}
