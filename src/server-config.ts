const serverConfig = {
    localServerUrl: 'http://localhost:3100/api/',
    productionServerUrl: 'http://195.150.230.157:3000/api/',
};

export default {
    serverUrl: location.hostname === 'localhost' ? serverConfig.localServerUrl : serverConfig.productionServerUrl
};
