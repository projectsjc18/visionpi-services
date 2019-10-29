'use strict'
const repository = (db, options) => {

  const collection = db.db(options.name).collection(options.collection);

  const getAllEvents = () => {
    return new Promise((resolve, reject) => {
      const events = []
      const cursor = collection.find({}, {})
      const addEvent = (eventx) => {
        events.push(eventx)
      }
      const sendEvents = (err) => {
        if (err) {
          reject(new Error('An error occured fetching all users, err:' + err))
        }
        resolve(events.slice())
      }
      cursor.forEach(addEvent, sendEvents)
    })
  }

  const getEventById = (account) => {
    return new Promise((resolve, reject) => {
      const sendEvent = (err, eventx) => {
        if (err) {
          reject(new Error(`An error occured fetching a user with id: ${id}, err: ${err}`))
        }
        resolve(eventx)
      }
      collection.findOne({account: account}, {}, sendEvent)
    })
  }

  const saveEvent = (eventx) => {
    return new Promise((resolve, reject) => {
      console.log('eventx')
      console.log(eventx)
      // Creates a new User based on the Mongoose schema and the post bo.dy
      const newEvent = {
        account: eventx.account,
        device: eventx.device,
        events: [{type: eventx.events.type, event: eventx.events.event, registerdate: generateDate()}],
        status: eventx.status,
        eventdate: generateDate()
      }
      console.log('newEvent')
      console.log(newEvent)
      // New User is saved in the db.
      collection.insertOne(newEvent, (err, eventxx) => {
        if(err)
          reject(new Error('an error occured registring a checkpoint, err:' + err));
        // If no errors are found, it responds with a JSON of the new user
        resolve(eventxx);
      })
    })
  }

  const updateEventById = (eventx) => {
    return new Promise((resolve, reject) => {
      const query = { "account": eventx.account, "operator": eventx.device };
      const update = {
        "$push": {
          "events": {
            "type": eventx.type,
            "event": eventx.event,
            "registerdate": generateDate()
          }
        }
      };
      const options = { "upsert": false };
      // Update document where a is 2, set b equal to 1
      collection.updateOne(query , update, (err, result) => {
        if(err)
          reject(new Error('an error occured update a checkpoint, err:' + err));
        // If no errors are found, it responds with a count
        resolve(result);
      })
    })
  }

  const deleteAllEvents = () => {
    return new Promise((resolve, reject) => {

    })
  }

  const deleteEventById = (eventx) => {
    return new Promise((resolve, reject) => {
      const query = { "account": eventx.account };
      collection.deleteOne(query, (err, result) => {
        if(err)
          reject(new Error('an error occured delete a checkpoint, err:' + err));
        // If no errors are found, it responds with a count
        resolve(result);
      })
    })
  }

  const generateDate = () => {
    const now = new Date();
    return now;
  }

  const disconnect = () => {
    db.close()
  }

  return Object.create({
    getAllEvents,
    getEventById,
    saveEvent,
    updateEventById,
    //deleteAllEvents,
    //deleteEventById,
    disconnect
  })
}

const connect = (connection, options) => {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error('connection db not supplied!'))
    }
    resolve(repository(connection, options))
  })
}

module.exports = Object.assign({}, {connect})
