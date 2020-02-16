'use strict'
const repository = (db, options) => {

  const accountsCollection = db.db(options.name).collection(options.accountsCollection);
  const checkpointsCollection = db.db(options.name).collection(options.checkpointsCollection);

  const getAllCheckpoints = () => {
    return new Promise((resolve, reject) => {
      const checkpoints = []
      const cursor = checkpointsCollection.find({}, {})
      const addCheckpoint = (checkpoint) => {
        checkpoints.push(checkpoint)
      }
      const sendCheckpoints = (err) => {
        if (err) {
          reject(new Error('An error occured fetching all checkpoints, err:' + err))
        }
        resolve(checkpoints.slice())
      }
      cursor.forEach(addCheckpoint, sendCheckpoints)
    })
  }

  const getCheckpointsByRoute = (route) => {
    return new Promise((resolve, reject) => {
      const checkpoints = []
      const cursor = checkpointsCollection.find({route: route}, {})
      const addCheckpoint = (checkpoint) => {
        checkpoints.push(checkpoint)
      }
      const sendCheckpoints = (err) => {
        if (err) {
          reject(new Error('An error occured fetching all checkpoints, err:' + err))
        }
        resolve(checkpoints.slice())
      }
      cursor.forEach(addCheckpoint, sendCheckpoints)
    })
  }

  /*const getCheckpointByRoute = (route) => {
    return new Promise((resolve, reject) => {
      const sendCheckpoint = (err, checkpoint) => {
        if (err) {
          reject(new Error(`An error occured fetching a user with id: ${id}, err: ${err}`))
        }
        resolve(checkpoint)
      }
      checkpointsCollection.findOne({route: route}, {}, sendCheckpoint)
    })
  }*/

  const getAccounts = () => {
    return new Promise((resolve, reject) => {
      const accounts = []
      const cursor = accountsCollection.aggregate(
        [
          {
            $project: {
              _id:0, account: 1,
              description: 1,
              status: 1,
              fleets: {
                $size: "$fleets"
              },
              routes: {
                $size: "$fleets.routes"
              },
              vehicles: {
                $size: "$fleets.routes.vehicles"
              }
            }
          }
        ]
      )
      const addAccount = (account) => {
        accounts.push(account)
      }
      const sendAccounts = (err) => {
        if (err) {
          reject(new Error('An error occured fetching all accounts, err:' + err))
        }
        resolve(accounts.slice())
      }
      cursor.forEach(addAccount, sendAccounts)
    })
  }

  const getAccountsDetails = () => {
    return new Promise((resolve, reject) => {
      const accounts = []
      const cursor = accountsCollection.find({}, {})
      const addAccount = (account) => {
        accounts.push(account)
      }
      const sendAccounts = (err) => {
        if (err) {
          reject(new Error('An error occured fetching details accounts, err:' + err))
        }
        resolve(accounts.slice())
      }
      cursor.forEach(addAccount, sendAccounts)
    })
  }

  const saveAccount = (account) => {
    return new Promise((resolve, reject) => {
      // Creates a new Account based on the Mongoose schema and the post bo.dy
      const newAccount = {
        account: account.account,
        user: account.user,
        description: account.description,
        status: account.status,
        fleets: [{
          id: account.fleet.identifier,
          name: account.fleet.name,
          description: account.fleet.fleetDescription,
          routes: [{
            id: account.route.routeIdentifier,
            name: account.route.routeName,
            description: account.route.routeDescription,
            vehicles: [{
              id: account.vehicle.vehicleIdentifier,
              brand: account.vehicle.brand,
              model: account.vehicle.model,
              year: account.vehicle.year,
              operator: account.vehicle.operator,
            }]
          }]
        }],
        created_at: generateDate()
      }

      // New User is saved in the db.
      accountsCollection.insertOne(newAccount, (err, account) => {
        if(err)
          reject(new Error('an error occured registring a checkpoint, err:' + err));
        // If no errors are found, it responds with a JSON of the new user
        resolve(account);
      })
    })
  }

  /*const saveCheckpoint = (checkpoint) => {
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
  }*/

  const saveCheckpoint = (checkpoint) => {
    return new Promise((resolve, reject) => {
      const query = { account: checkpoint.account, fleet: checkpoint.fleet, route: checkpoint.route, vehicle: checkpoint.vehicle };
      const update = {
        "$push": {
          "checkpoints": {
            "lat": checkpoint.lat,
            "lng": checkpoint.lng,
            "operator": checkpoint.operator,
            "registerDate": generateDate()
          }
        }
      };
      const options = { "upsert": true };
      // Update document where a is 2, set b equal to 1
      checkpointsCollection.update(query , update, options, (err, result) => {
        if(err)
          reject(new Error('an error occured update a checkpoint, err:' + err));
        // If no errors are found, it responds with a count
        resolve(result);
      })
    })
  }

  const updateCheckpointById = (checkpoint) => {
    return new Promise((resolve, reject) => {
      const query = { "account": checkpoint.account, "vehicle.id": checkpoint.vehicle };
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
      checkpointsCollection.updateOne(query , update, (err, result) => {
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
      checkpointsCollection.deleteOne(query, (err, result) => {
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

  const validateRouteExist = () => {

  }

  const disconnect = () => {
    db.close()
  }

  return Object.create({
    getAllCheckpoints,
    getCheckpointsByRoute,
    getAccounts,
    getAccountsDetails,
    saveAccount,
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
