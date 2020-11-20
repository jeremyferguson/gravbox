# Gravbox IDE

This is an interpreter and a web-based IDE for the esoteric programming language Gravbox, whose original specification can be found [here](https://esolangs.org/wiki/Gravbox).  The language is a 2-dimensional language that consists of balls which fall according to gravity and interact with different elements on a board to push to a stack, perform arithmetic, and manipulate gravity.

## Getting Started

The interpreter can be run in any version of Python 3, with command line arguments:
- filename: the name of the file to be run, with extension .grv
- v: verbose, prints debugging output as it runs
- s: interval of frames to print out, allows to see intermediate stages of program as it runs

The web IDE is built using a Flask back-end and React front-end.  To run the IDE, run `yarn start-api` in one terminal window and `yarn start` in another to open the IDE in a web browser. There is also a pure Javascript version of the front end, which can be run by opening `grav_basic.html` in a web browser and running the flask backend by `yarn start-api`

## Sample programs
The sample programs in the repository show some basic functions of Gravbox, and can be run through the command line
- beer.grv - Prints out the song "99 bottles of beer on the wall"
- factorial.grv - Takes an integer as input, and prints out all factorials from 2 to that number
- forloop.grv - Prints out all the integers from 1 to 10, illustration of a loop concept
- DeflectorTest.grv - Tests the deflection capabilities, see the language spec for more details on how they should work
- HelloWorld.grv - Prints out Hello, World
- input.grv - Takes in input, and prints it out
- HelloWorldMultiple.grv - Prints out Hello, World, but uses multiple balls to do so

In addition, several of these programs can be found on the IDE, and can be loaded and ran from there 
 
### Prerequisites
Python 3, and Flask

## Built With

* [Python](https://www.python.org/) 
* [React](https://reactjs.org/)
* [Flask](https://flask.palletsprojects.com/en/1.1.x/)

## Authors

* **Jeremy Ferguson** - [jeremyferguson](https://github.com/jeremyferguson)

## Acknowledgments

* Original concept of the idea was from Esolang Wiki user [Moonythedwarf](https://en.wikipedia.org/wiki/User:Moonythedwarf)

