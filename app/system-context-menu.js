const Registry = require('winreg');

const appPath = `"${process.execPath}"`;
const regKey = `\\Software\\Classes\\Directory\\background\\shell\\Procli`;
const regParts = [
  {key: 'command', name: '', value: `${appPath} "%V"`},
  {name: '', value: 'Open Procli here'},
  {name: 'Icon', value: `${appPath}`}
];

function addValues(procliKey, commandKey, callback) {
  procliKey.set(regParts[1].name, Registry.REG_SZ, regParts[1].value, error => {
    if (error) {
      //eslint-disable-next-line no-console
      console.error(error.message);
    }
    procliKey.set(regParts[2].name, Registry.REG_SZ, regParts[2].value, err => {
      if (err) {
        //eslint-disable-next-line no-console
        console.error(err.message);
      }
      commandKey.set(regParts[0].name, Registry.REG_SZ, regParts[0].value, err_ => {
        if (err_) {
          //eslint-disable-next-line no-console
          console.error(err_.message);
        }
        callback();
      });
    });
  });
}

exports.add = callback => {
  const procliKey = new Registry({hive: 'HKCU', key: regKey});
  const commandKey = new Registry({
    hive: 'HKCU',
    key: `${regKey}\\${regParts[0].key}`
  });

  procliKey.keyExists((error, exists) => {
    if (error) {
      //eslint-disable-next-line no-console
      console.error(error.message);
    }
    if (exists) {
      commandKey.keyExists((err_, exists_) => {
        if (err_) {
          //eslint-disable-next-line no-console
          console.error(err_.message);
        }
        if (exists_) {
          addValues(procliKey, commandKey, callback);
        } else {
          commandKey.create(err => {
            if (err) {
              //eslint-disable-next-line no-console
              console.error(err.message);
            }
            addValues(procliKey, commandKey, callback);
          });
        }
      });
    } else {
      procliKey.create(err => {
        if (err) {
          //eslint-disable-next-line no-console
          console.error(err.message);
        }
        commandKey.create(err_ => {
          if (err_) {
            //eslint-disable-next-line no-console
            console.error(err_.message);
          }
          addValues(procliKey, commandKey, callback);
        });
      });
    }
  });
};

exports.remove = callback => {
  new Registry({hive: 'HKCU', key: regKey}).destroy(err => {
    if (err) {
      //eslint-disable-next-line no-console
      console.error(err.message);
    }
    callback();
  });
};
