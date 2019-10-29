'use strict'
const repository = (db, options) => {

  const collection = db.db(options.name).collection(options.collection);

  const getAllCheckpoints = () => {
    return new Promise((resolve, reject) => {
      const checkpoints = []
      const cursor = collection.find({}, {})
      const addCheckpoint = (checkpoint) => {
        checkpoints.push(checkpoint)
      }
      const sendCheckpoints = (err) => {
        if (err) {
          reject(new Error('An error occured fetching all users, err:' + err))
        }
        resolve(checkpoints.slice())
      }
      cursor.forEach(addCheckpoint, sendCheckpoints)
    })
  }

  const getCheckpointById = (id) => {
    return new Promise((resolve, reject) => {
      const sendCheckpoint = (err, checkpoint) => {
        if (err) {
          reject(new Error(`An error occured fetching a user with id: ${id}, err: ${err}`))
        }
        resolve(checkpoint)
      }
      collection.findOne({userid: id}, {}, sendCheckpoint)
    })
  }

  const saveCheckpoint = (checkpoint) => {
    return new Promise((resolve, reject) => {
      // Creates a new User based on the Mongoose schema and the post bo.dy
      const newCheckpoint = {
        account: checkpoint.account,
        collective: checkpoint.collective,
        fleet: checkpoint.fleet,
        checkpoints: [{lat: checkpoint.lat, lng: checkpoint.lng, registerdate: generateDate()}],
        operator: checkpoint.operator,
        route: checkpoint.route,
        created_at: generateDate()
      }

      // New User is saved in the db.
      collection.insertOne(newCheckpoint, (err, checkpoint) => {
        if(err)
          reject(new Error('an error occured registring a checkpoint, err:' + err));
        // If no errors are found, it responds with a JSON of the new user
        resolve(checkpoint);
      })
    })
  }

  const updateCheckpointById = (checkpoint) => {
    return new Promise((resolve, reject) => {
      const query = { "account": checkpoint.account, "operator": checkpoint.operator };
      const update = {
        "$push": {
          "checkpoints": {
            "lat": checkpoint.lat,
            "lng": checkpoint.lng,
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

  const deleteAllCheckpoints = () => {
    return new Promise((resolve, reject) => {

    })
  }

  const deleteCheckpointById = (checkpoint) => {
    return new Promise((resolve, reject) => {
      const query = { "account": checkpoint.account };
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
    getAllCheckpoints,
    getCheckpointById,
    saveCheckpoint,
    updateCheckpointById,
    //deleteAllCheckpoints,
    //deleteCheckpointById,
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
