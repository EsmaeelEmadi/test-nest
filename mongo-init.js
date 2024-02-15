db.createUser({
  user: 'emad',
  pwd: 'mohesem',
  roles: [
    {
      role: 'readWrite',
      db: 'nest',
    },
  ],
});
