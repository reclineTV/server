# Recline
Recline is a home media server designed to be extremely easy to extend and use. It's a very early work in progress at the moment, but you're welcome to help contribute!

# Design Goals

* User input is precious.
It's often awkward to provide input to a TV. Recline will attempt to make the most of every button press by unifying its UI rather than separating it up into apps.

* One search through all content.
You shouldn't have to go into a Netflix app to search for House of Cards. Rather than being app focused, Recline is content focused. One voice/ text search which is sent to all of your extensions.

* Support convenient input.
Your TV probably has everything it needs to support using a wiimote to control it - select content by simply pointing at it.

* API driven design.
The server is a beautifully simple http JSON API. This makes it great to automate and easy to design custom UI's for in whatever language you want. The default UI is a React app written in JavaScript.

# Installation

Recline currently works with a MySQL/ MariaDB database. You'll need to create an empty database and configure it in source/settings.js (this will be getting exposed from the module shortly).
