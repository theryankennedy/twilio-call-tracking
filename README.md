# Call tracking with Twilio, Node.js, and Express

This application demonstrates how to use Twilio to track calls and measure the effectiveness of marketing campaigns.

NOTE:  This demo was created for use in a webinar.  It has some hardcoded things to make the webinar run smoothly.


## Running the Project on Your Machine

This project requires [Node.js](http://nodejs.org/) 6 or greater and MongoDB.

You can download and run MongoDB
yourself ([OS X](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/),
[Linux](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/),
[Windows](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/)),
or you can use a hosted service like
[compose.io](https://www.compose.io/).

On OS X, the maybe the easiest way to get MongoDB running locally is to install
via [Homebrew](http://brew.sh/).

```bash
brew install mongodb
```

You should then be able to run a local server with:

```bash
mongod
```

By default, there will be a local database running that's not password protected.
In your `.env` file, set `MONGO_URL` to `mongodb://127.0.0.1/calltracking`.

### Install Dependencies

Navigate to the project directory in your terminal and run:

```bash
npm install
```

### Prepare Twilio account

NOTE: This project requires a handful of Twilio components.  In order to keep them organized, it can be helpful to use a subaccount.

You will need to get the following information from the Twilio console and set them in the .env file (see Configuration section below):

#### Account Sid and Auth Token
These are located on the home page of your account (or subaccount).

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xyxyxyxyxyxyxyxyxyxyxyxyxyxyx

#### Api Key and Secret

TWILIO_API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_SECRET=xyxyxyxyxyxyxyxyxyxyxyxyxyxyx

#### TwiML App, for calls
TWILIO_APP_SID=APxxxxxxxxxxxxxxxxxxxxxxxxxx

#### TwiML App, for the Agent (Twilio Client)
TWILIO_CLIENT_APP_SID=APxxxxxxxxxxxxxxxxxxxxxxxxxx


#### Sync setup
Twilio Sync is in developer preview.  Contact Twilio's sales department to get access.

You will need the api key and secret you created earlier:
TWILIO_API_KEY
TWILIO_API_SECRET

Use your TWILIO_API_KEY and TWILIO_API_SECRET to generate a Sync service.  The result of this command will have a sid that will be the TWILIO_SYNC_SERVICE_SID

```bash
curl -X POST https://preview.twilio.com/Sync/Services \
 -d 'FriendlyName=CallTrackingSyncService' \
 -u '$TWILIO_API_KEY:$TWILIO_API_SECRET'
 ```

TWILIO_SYNC_SERVICE_SID=ISxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


A phone number for incoming calls to the Agent (optional)
TWILIO_CLIENT_CALLER_ID=

#### IVR number
The phone number for dialing into an IVR
IVR_NUMBER=

#### Twilio Client name
(optional) define the the Twilio Client agent name here.  Defaults to 'Agent'
AGENT_NAME=

#### Base Url
The base url where this app is running.
BASE_URL=https://twilio-call-tracking.herokuapp.com

#### Google Analytics Tracking Id
Your Google Analytics Tracking Id, injected into the /ad page
GA_ID=

#### Mongo Url
MongoDb url, described above:
MONGO_URL=mongodb://127.0.0.1/calltracking



## AddOns
Enable these add-ons for incoming calls and lookups:

Marchex Clean Call
Whitepages Pro Caller Id
Advanced Caller Id by Next Caller - Incoming Voice Call
VoiceBase High Accuracy Transcription


### Configuration

This application is configured using [dotenv](https://www.npmjs.com/package/dotenv).
Begin by copying the example .env file to use in this application:

```bash
cp .env.example .env
```

Next, open the `.env` at the root of the project and update it with credentials
from your Twilio account. You will also need to set `MONGO_URL`, which is how we
will connect to our database.

### Running the Project

To launch the application, you can use `node .` in the project's root directory.
You might also consider using [nodemon](https://github.com/remy/nodemon) for
this. It works just like the node command, but automatically restarts your
application when you change any source code files.

```bash
npm install -g nodemon
nodemon .
```


### Exposing Webhooks to Twilio

To test your application locally with a Twilio number, we recommend using
[ngrok](https://ngrok.com/docs). Use ngrok to expose a local port and get a
publicly accessible URL you can use to accept incoming calls or texts to your
Twilio numbers.

The following example would expose your local Node application running on port
3000 at `http://chunky-danger-monkey.ngrok.io` (note that *reserved* subdomains
are a paid feature of ngrok):

```bash
ngrok http -subdomain=chunky-danger-monkey 3000
```

In your Twilio app configuration you'll need to set
`http://<your-ngrok-domain>.ngrok.io/call` as the callback URL.


## License

MIT
