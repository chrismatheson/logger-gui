Logger-GUI
==========

Joe's masters project GUI

This application takes basic JSON strings from a com port and graphs the output into a web-app GUI.

The GUI uses Flot for graphing and Backbone for most of the framework.

The server application serves up mostly static pages using express from /public ad provides endpoints for http calls.

The input JSON string is in just a JSON encoded JS object with only one property. Each Key will create a 'Buffer' Array (not a true buffer) of 100 values timestamped and then allow a http call to http://localhost/data/<key value> to return this array to the GUI for graphing.

Most of this is best explained with an example.

server recieves serial input to COM2 "{'temp_sensor':21.2}\n"
creates array equivilent to var temp_sensor = [].push([(new Date()).getTime(),21.2]);
subsiquent messages as such are added.....

"{'temp_sensor':21.2}\n"
"{'temp_sensor':21.3}\n"
"{'temp_sensor':21.1}\n"
"{'temp_sensor':21.5}\n"

temp_sensor = [[(new Date()).getTime(),21.2],[(new Date()).getTime(),21.2],[(new Date()).getTime(),21.3],[(new Date()).getTime(),21.1],[(new Date()).getTime(),21.5]]


to add this to the GUI you just add a new div element as so

<div id="temp_sensor" class="graph" style="width:400px;height:200px"></div>

style info and other graph options see flot docs.

