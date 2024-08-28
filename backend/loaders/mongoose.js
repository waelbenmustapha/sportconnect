import mongoose from 'mongoose';


export default async () => {
  const databaseUrl = process.env.DATABASE_URL || "mongodb+srv://benmstphaadem:TdM8KpcPAcDQd0kN@cluster0.lbr14.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  mongoose.set("strictQuery", false);
  await mongoose.connect(databaseUrl, {})  
    .then(() => {
      console.log('Mongodb Connection');
    })
    .catch(err => {
      console.error("error while connecting to mongoodb",err);
    });
};