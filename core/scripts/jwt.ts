import jwt from 'jsonwebtoken';

const privateKey = process.env.AUTH_SECRET;

var token = jwt.sign(
  {
    name: 'Furkan Alan',
    email: 'furkanalan@hotmail.com',
    picture: 'https://avatars.githubusercontent.com/u/24752545?v=4',
    sub: 'clvh4h2p80000je1fqlvoztam',
    iat: 1714237340,
  },
  privateKey,
  {
    expiresIn: 1000,
  },
);
console.log('token: ', token);

jwt.verify(token, privateKey, (err, verified) => {
  if (err) {
    console.log('err: ', err);
    return;
  }
  console.log('verified: ', verified);
});

const decoded = jwt.decode(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRnVya2FuIEFsYW4iLCJlbWFpbCI6ImZ1cmthbmFsYW5AaG90bWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzI0NzUyNTQ1P3Y9NCIsInN1YiI6ImNsdmg0aDJwODAwMDBqZTFmcWx2b3p0YW0iLCJpYXQiOjE3MTQyNDExNDh9.1nnJolB_xYx5Cq7aRiBuwbWu3srEcCyL4ayXKUjj_KQ',
);
console.log('decoded: ', decoded);
