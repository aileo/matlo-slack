const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const async = require('async');
const moment = require('moment');
const matlo = require('matlo');

const metadata = require('./metadata');

const conf = {
  slack: {
    token: process.env.SLACK_TOKEN,
  },
  matlo: {
    token: process.env.MATLO_TOKEN,
    user: process.env.MATLO_USER,
    dashboard: process.env.MATLO_DASHBOARD,
  },
};

const init = [
  cb => {
    matlo.clientFromToken({ token: conf.matlo.token }, cb);
  },
];

if (!conf.matlo.dashboard) {
  init.push((client, cb) => {
    console.log('Trying to create dashboard');
    client.user.createDashboard(
      {
        params: { uid: conf.matlo.user },
        data: { title: 'slack', tags: ['slack', 'API', 'automated'] },
      },
      (error, response) => {
        if (error) {
          cb(error);
        } else {
          console.log('Dashboard created');
          conf.matlo.dashboard = response.result.dashboard.uuid;
          cb(null, client);
        }
      }
    );
  });

  init.push((client, cb) => {
    client.metadata.set(
      {
        params: { did: conf.matlo.dashboard },
        data: { metadata },
      },
      (error, response) => {
        if (error) {
          cb(error);
        } else {
          console.log('Init dashboard data type');
          cb(null, client);
        }
      }
    );
  });
}

async.waterfall(init, (error, client) => {
  const server = http.createServer((req, res) => {
    console.log('New request');
    if (req.method === 'POST') {
      const body = [];
      req.on('data', data => body.push(data));
      req.on('end', () => {
        const data = qs.parse(body.join(''));

        if (data.token !== conf.slack.token) {
          res.statusCode = 401;
          res.end();
          console.log('Rejected');
        } else {
          console.log('Accepted');
          client.data.send(
            {
              params: { did: conf.matlo.dashboard },
              data: {
                data: [
                  [
                    data.team_id,
                    data.team_domain,
                    data.service_id,
                    data.channel_id,
                    data.channel_name,
                    moment(data.timestamp).format('YYYY/MM/DD HH:mm:ss'),
                    data.user_id,
                    data.user_name,
                    data.text,
                  ],
                ],
              },
            },
            () => {
              res.statusCode = 200;
              res.end();
            }
          );
        }
      });
    } else {
      res.statusCode = 500;
      res.end();
      console.log('Rejected');
    }
  });

  server.listen(3500);
});
