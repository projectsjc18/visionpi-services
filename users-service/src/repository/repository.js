'use strict'
const bcrypt = require('bcryptjs');
const axios = require('axios');
//const request = require('request');

const repository = (db, options) => {

  const collection = db.db(options.name).collection(options.usersCollection);

  const getAllUsers = () => {
    return new Promise((resolve, reject) => {
      const users = []
      const cursor = collection.find({}, {title: 1, id: 1})
      const addUser = (user) => {
        users.push(user)
      }
      const sendUsers = (err) => {
        if (err) {
          reject(new Error('An error occured fetching all users, err:' + err))
        }
        resolve(users.slice())
      }
      cursor.forEach(addUser, sendUsers)
    })
  }

  const getUsersPrivileges = () => {
    return new Promise((resolve, reject) => {
      const users = []
      const currentDay = new Date()
      const query = {
        releaseYear: {
          $gt: currentDay.getFullYear() - 1,
          $lte: currentDay.getFullYear()
        },
        releaseMonth: {
          $gte: currentDay.getMonth() + 1,
          $lte: currentDay.getMonth() + 2
        },
        releaseDay: {
          $lte: currentDay.getDate()
        }
      }
      const cursor = collection.find(query)
      const addUser = (user) => {
        users.push(user)
      }
      const sendUsers = (err) => {
        if (err) {
          reject(new Error('An error occured fetching all users, err:' + err))
        }
        resolve(movies)
      }
      cursor.forEach(addUser, sendUsers)
    })
  }

  const getUserById = (id) => {
    return new Promise((resolve, reject) => {
      const sendUser = (err, user) => {
        if (err) {
          reject(new Error(`An error occured fetching a user with id: ${id}, err: ${err}`))
        }
        resolve(user)
      }
      collection.findOne({userid: id}, {}, sendUser)
    })
  }

  const getUserByUser = (user) => {
    console.log("By user:" + user)
    return new Promise((resolve, reject) => {
      const sendUser = (err, user) => {
        if (err) {
          reject(new Error(`An error occured fetching a user with id: ${id}, err: ${err}`))
        }
        resolve(user)
      }
      collection.findOne({username: user}, {}, sendUser)
    })
  }

  const getUserByUserAccount = (user_account) => {
    console.log("By user-account:" + user_account)
    return new Promise((resolve, reject) => {
      const userAccounts = []
      const cursor = collection.find(
        { $or: [
            { username: new RegExp( ".*" + user_account + ".*", "i" ) },
            { account: new RegExp( ".*" + user_account + ".*", "i" ) }
          ]
        }, { projection: { _id:0, account: 1, username: 1 }})
      const addUserAccount = (userAccount) => {
        userAccounts.push(userAccount)
      }
      const sendUserAccounts = (err) => {
        if (err) {
          reject(new Error(`An error occured fetching a user with id: ${id}, err: ${err}`))
        }
        resolve(userAccounts.slice())
      }
      cursor.forEach(addUserAccount, sendUserAccounts)
    })
  }

  const saveUser = (user) => {
    return new Promise((resolve, reject) => {
      console.log("New user");
      console.log(user);
      // Creates a new User based on the Mongoose schema and the post bo.dy
      const newUser = {
        account: user.account,
        userid: user.userid,
        username: user.username,
        password: bcrypt.hashSync(user.password, 10),
        firstname: user.firstname,
        lastname: user.lastname,
        gender: user.gender,
        birth: user.birth,
        email: user.email,
        profile: user.profile,
        createdAt: generateDate(),
        updatedAt: generateDate(),
        platforms: loadPlatforms(user.platforms)
      }

      // New User is saved in the db.
      collection.insertOne(newUser).then(aux => {
          const response = sendAuthService(user);
          if(response != 'unsuccesful')
            resolve(aux);
        }).catch(err => {
          reject(new Error('an error occured registring a user, err:' + err));
        })
      })
    }
  //}

  const generatePassword = (password) => {
    //const newHash = "";
    const newHash = bcrypt.hash(password, 10, (err, hash) => {
      if(!err){
        console.log("hash: " + hash);
        return hash;
      }
    })
    return newHash;
  }

  const validatePassword = (password) => {
    bcrypt.compare(password, 10, (err, res) => {
      if(res) {
        return true;
      } else {
        return false;
      }
    })
  }

  const generateDate = () => {
    const now = new Date();
    return now;
  }

  const sendAuthService = (data) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      data: data
    };
    axios.post(`${options.authentication}/auth/users`, config)
    .then(response => {
      console.log("Succes auth service");
      return response.data;
    })
    .catch(err => {
      console.log('Error user to auth:' + err);
      return 'unsuccesful';
    });
    /*return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        uri: options.authentication + '/auth/users',
        body: data,
        function (error, response, body){
          if(response.statusCode == 200){
            console.log('Success save auth user')
            resolve(data)
          } else {
            console.log('error save auth user: '+ response.statusCode)
            reject(new Error('error: ' + error))
          }
        }
      })
    })*/
  }

  const loadPlatforms = (platforms) => {
    var notifications = {};
    var options = [];
    var permissions = {};
    console.log('-------------------platforms');
    platforms.services.forEach(obj => {
        console.log(obj);
        switch (obj) {
          case 'Dashboard':
            options.push({ "title":"dashboard", "url": "/home/dashboard/administration", "icon": "list" });
            break;
          case 'User':
            options.push({ "title":"user", "url": "/home/user/administration", "icon": "person" });
            break;
          case 'Geolocalization':
            options.push({ "title":"localization", "url": "/home/geolocalization/administration", "icon": "satellite" });
            break;
          case 'Monitoring':
            options.push({ "title":"surveillance", "url": "/home/surveillance/administration", "icon": "videocam" });
            break;
          case 'Surveillance':
            options.push({ "title":"monitoring", "url": "/home/monitoring/administration", "icon": "alarm" });
            break;
          default:

        }
        console.log('-------------------');
    });
    var web = {"web": {"options": options, "permissions": permissions, "notifications": notifications}};
    return web;
  }

  const disconnect = () => {
    db.close()
  }

  return Object.create({
    getAllUsers,
    getUsersPrivileges,
    getUserById,
    getUserByUser,
    getUserByUserAccount,
    saveUser,
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
