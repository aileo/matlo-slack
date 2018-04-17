# matlo-slack

## Capture message from slack to display them in Matlo dashboard

### Configuration

This script is configured with environment variables :

**SLACK_TOKEN** : Token from the slack outgoing webhook, mandatory.

**MATLO_TOKEN** : Authentication token for Matlo, mandatory.

**MATLO_DASHBOARD** : Uuid of the dashboard to send data to,
mandatory if no user specified.

**MATLO_USER** : Uuid of the user which gonna own the dashboard,
mandatory if no dashboard specified.

### Run with nodejs

```bash
SLACK_TOKEN="[...]" \
MATLO_TOKEN="[...]" \
MATLO_USER="[...]" \
npm start
```

### Run with docker

```bash
docker run \
  -d \
  -p 3500:3500 \
  -e SLACK_TOKEN="[...]" \
  -e MATLO_TOKEN="[...]" \
  -e MATLO_USER="[...]" \
  aileo/matlo-slack
```

### Contributions

This project only exists as an exemple of the possible integrations with Matlo REST API.
However, issues and pull requests are always welcome.

### License

Matlo-client is under [MIT license](./LICENSE).
