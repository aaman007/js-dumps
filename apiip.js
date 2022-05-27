const apiip = require('apiip.net')('36452b7e-d6aa-4248-8e14-47fef98bdfbb');

apiip
    .getLocation({
        ip: '27.147.234.205'
    })
    .then((results) => console.log(results))
    .catch((error) => console.error(error));