const MongoClient =  require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/Todoapp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to mongo db server');
  }
  console.log('Connected to MondoDB server');

  const db = client.db('Todoapp');
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // } , (err, result) => {
  //   if (err) {
  //     return console.log('Undable to insert todo');
  //   }
  //   console.log(JSON.stringify(result.ops, undefined,2));
  // });

   db.collection('Users').insertOne({
     name: 'Gordon',
     age:35,
     location: 'SG'
  } , (err, result) => {
    if (err) {
      return console.log('Undable to insert user');
    }
    console.log(JSON.stringify(result.ops, undefined,2));
  });




  client.close();
});
