# Recline
Recline is a home media server designed to be easy to extend and use. It's a very early work in progress at the moment, but you're welcome to help contribute!

# Design Goals

* User input is precious.
It's often awkward to provide input to a TV. Recline will attempt to make the most of every button press by unifying its UI rather than separating it up into apps.

* One search through all content.
You shouldn't have to go into a Netflix app to search for House of Cards. Rather than being app focused, Recline is content focused. One voice/ text search which is sent to all of your extensions.

* Support convenient input.
Your TV probably has everything it needs to support using a wiimote to control it - select content by simply pointing at it.

* API driven design.
The server is a beautifully simple http JSON API. This makes it great to automate and easy to design custom UI's for in whatever language you want. The default UI is a React app written in JavaScript.

# Requirements

To run a Recline server, you'll need:

* The full version of ffmpeg installed, with at least AAC and H264 support. This is used for transcoding when necessary.
* A MySQL or MariaDB database.
* Node.js

# Installation

```
npm install -g recline-server
recline
```

Running recline the first time will tell you where your config file is located. You'll need to edit this config file to point at your database.

To setup your database, run database/install.sql from the Recline server repository.
