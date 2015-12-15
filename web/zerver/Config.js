printConfig();

function printConfig() {
    console.log('Config:');
    for (var k in exports) {
        if (k !== 'getInjections') {
            console.log('-', k+': ', exports[k]);
        }
    }
    if (process.env.INJECTIONS) {
      console.log('-', 'INJECTIONS: ', process.env.INJECTIONS);
    }
    console.log('');
}

function getInjections() {
    return getInjectables().map(function (f) {
        return fs.readFileSync(f).toString();
    });
}

function getInjectables() {
    var injectables = [];
    if (process.env.INJECTIONS) {
        process.env.INJECTIONS.split(/,/).forEach(function (f) {
            f = f.trim();
            if (f) {
                injectables.push(f);
            }
        });
    }
    return injectables;
}

function getLanIp() {
    var interfaces = os.networkInterfaces();
    for (var i in interfaces) {
        var ifaceList = interfaces[i];
        for (var j=0; j<ifaceList.length; j++) {
            var iface = ifaceList[j];
            if (iface.address && iface.address !== '0.0.0.0' && iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}
