import mongoose from "mongoose";
import "dotenv/config";

mongoose.set("strictQuery", false);

const url = process.env.MONGO_DB_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to Mongo database");
  })
  .catch((err) => {
    console.log("Error connecting to Mongo database, ", err.message);
  });

const phoneNumberValidator = (value) => {
  return /\d{2,3}-/.test(value);
};

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 9,
    validate: phoneNumberValidator,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

export default mongoose.model("Person", personSchema);
