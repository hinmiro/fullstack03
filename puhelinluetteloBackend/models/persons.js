import Person from "../services/mongo.js";

const getPersons = () => {
  return Person.find({}).then((result) => {
    return result;
  });
};

const postPerson = (name, number) => {
  const person = new Person({ name: name, number: number });
  return person.save().then((result) => {
    console.log(`Added ${name} to database`);
    return result;
  });
};

const removePerson = (id) => {
  return Person.findByIdAndDelete(id).then((res) => {
    return res;
  });
};

const updatePerson = (id, person) => {
  return Person.findByIdAndUpdate(id, person, { new: true }).then(
    (returnedPerson) => {
      return returnedPerson;
    },
  );
};

const findById = (id) => {
  return Person.findById(id).then((contact) => {
    return !contact ? null : contact;
  });
};

export { getPersons, postPerson, removePerson, updatePerson, findById };
