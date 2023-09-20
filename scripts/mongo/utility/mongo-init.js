db.createUser({
    user: 'myusername',
    pwd: 'mypassword',
    roles: [
      {
        role: 'dbOwner',
        db: 'ChatRoom',
      },
    ],
  });