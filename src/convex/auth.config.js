const authConfig = {
  providers: [
    {
      domain: process.env.AUTH0_DOMAIN || 'dev-wbnbi7kco2rcxkqp.us.auth0.com',
      applicationID: process.env.AUTH0_CLIENT_ID || 'TFyktmqjl4PGkxv3ZtEf4xPOb4dsGjj5',
    },
  ],
};

export default authConfig;