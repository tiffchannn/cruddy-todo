const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////


exports.create = (text, callback) => {
  var id = counter.getNextUniqueId();
  items[id] = text;
  var newFile = path.join(__dirname, `./data/${id}.txt`);
  fs.writeFile(newFile, text, (err) => {
    if (err) {
      throw ('error making todo');
    } else {
      // callback(null, { id, text });
      return text;
    }
  });
  callback(null, { id, text });
};

exports.readAll = (callback) => {
  var dirToRead = path.join(__dirname, '/data');
  fs.readdir(dirToRead, (err, fileNames) => {
    if (err) {
      throw ('reading error');
    } else {
      fileNames.forEach((fileName) => {
        fs.readFile(dirToRead + '/' + fileName, (err, content) => { // /datastore/data/00000.txt
          if (err) {
            throw ('reading individual file error');
          } else {
            items[fileName.substring(0, 5)] = fileName.substring(0, 5);
          }
        });
      });
    }
  });

  console.log('items obj', items);
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var dirToRead = path.join(__dirname, '/data');
  var text = items[id];

  var fileName = id + '.txt';

  fs.readFile(dirToRead + '/' + `${id}.txt`, (err, content) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      var toDoItem = {'id': id, 'text': content.toString()};
      callback(null, toDoItem );
    }
  });
};

exports.update = (id, text, callback) => {
  var dirToRead = path.join(__dirname, '/data');
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    fs.writeFile(dirToRead + '/' + `${id}.txt`, text, (err) => {
      if (err) {
        throw ('error at updating file');
      } else {
        items[id] = text;
        callback(null, { id, text });
      }
    });
  }
};

exports.delete = (id, callback) => {
  var dirToRead = path.join(__dirname, '/data');
  var item = items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    delete items[id];
    fs.unlink(dirToRead + '/' + `${id}.txt`, (err) => {
      if (err) {
        throw err;
      } else {
        console.log('successfully deleted');
        callback();
      }
    });
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
