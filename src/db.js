const mongoose = require('mongoose');

module.exports = async (uri) => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('✅ MongoDB conectado');
};
