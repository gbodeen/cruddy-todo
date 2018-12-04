const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    let fileName = __dirname + '/data/' + id + '.txt';
    //console.log('exports.create fileName: ', fileName);
    fs.writeFile(fileName, text, (err) => {
      if (err) {
        throw ('error writing file: ', fileName);
      } else {
        callback(null, { id, text });
      }
    });
  });
  // items[id] = text;
};

exports.readAll = (callback) => {
  var data = [];
  // console.log('Inside readAll');
  fs.readdir(__dirname + '/data', (err, files) => {
    _.each(files, (file, index) => {
      fs.readFile(__dirname + '/data/' + file, (err, fileData) => {
        data.push({ id: file.slice(0, -4), text: fileData.toString() });
        // console.log('---IN EACH--- Data: ', data);
        if (index === files.length - 1) {
          callback(null, data);
        }
      });
    });
    if (files.length === 0) {
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readdir(__dirname + '/data', (err, files) => {
    if (files.includes(id + '.txt')) {
      fs.readFile(__dirname + '/data/' + id + '.txt', (err, fileData) => {
        callback(null, { id, text: fileData.toString() });
      });
    } else {
      callback(new Error(`No item with id: ${id}`));
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readdir(__dirname + '/data', (err, files) => {
    if (files.includes(id + '.txt')) {
      fs.writeFile(__dirname + '/data/' + id + '.txt', text, (err) => {
        callback(null, { id, text });
      });
    } else {
      callback(new Error(`No item with id: ${id}`));
    }
  });
};

exports.delete = (id, callback) => {
  fs.readdir(__dirname + '/data', (err, files) => {
    if (files.includes(id + '.txt')) {
      fs.unlink(__dirname + '/data/' + id + '.txt', (err) => {
        callback();
      });
    } else {
      callback(new Error(`No item with id: ${id}`));
    }
  });

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
