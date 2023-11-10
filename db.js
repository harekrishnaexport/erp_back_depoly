const mongoose = require('mongoose');

const mongourl = `mongodb+srv://harekrishnaglobalexport:pXAyEZwk6Ne2bZse@cluster0.xedieqz.mongodb.net/HareKrishnaGlobalExport?retryWrites=true&w=majority`;

const mongoconnect = async () => {
  try {
    mongoose.connect(mongourl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    }).then((result) => {
       console.log('connect')
    })
  } catch (error) {
     console.log("mongoose error ===================>", error);
  }
};

module.exports = mongoconnect;
