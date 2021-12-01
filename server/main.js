import { Meteor } from 'meteor/meteor';

import '/imports/server/methods/index.js';

// Redirect non-kennisbank.nijverhoekrotterdam.nl URL to correct domain
WebApp.rawConnectHandlers.use(
  (req, res, next) => {

    /**
     * Redirect incorrect URL to correct URL (in production)
     */
    if (
      process.env.NODE_ENV != 'development' &&
      ! req.headers.host.includes('kennisbank.')
    ) {
      res.writeHead(
        301, {
          'Location': 'https://kennisbank.nijverhoekrotterdam.nl' + req.originalUrl,
        }
      );
      return res.end();
    }

    /**
     * Keep going
     * /!\ DO NOT DELETE /!\
     */
    return next();
  }
);