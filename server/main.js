import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import Spiderable from 'meteor/ostrio:spiderable-middleware';

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

// Register middleware
WebApp.connectHandlers.use(new Spiderable({
  rootURL: 'https://kennisbank.nijverhoekrotterdam.nl',
  serviceURL: 'https://render.ostr.io',
  auth: `${process.env.OSTRIO_API_USER}:${process.env.OSTRIO_API_PASS}`
}));
