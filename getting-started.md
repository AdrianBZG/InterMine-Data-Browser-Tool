# Getting Started with the InterMine Data Browser

If you're setting up the Data Browser locally, perhaps to fix a bug or contribute a pull request, here's how you can do it.

## Prerequisites

A recent version of [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/)

## Clone the repository to your host

Head to the directory in your host machine where you want to clone/place the repository and then enter the following commands on your terminal window:

``` bash
# Clone the repository
git clone https://github.com/intermine/InterMine-Data-Browser-Tool.git

# Change present working directory
cd InterMine-Data-Browser-Tool
```

## Install dependencies

In a console, run this command from the Data Browser root folder to install all the project dependencies:

``` bash
npm install
```

## Run the tests

To ensure that everything works correctly before or after some changes are made to the code base, run the tests from your console using the following command:

``` bash
npm test
```

If all the test cases run without failing then it means that you are now ready to make a pull request or can proceed further to the next step.

## Launch GulpJs Tasks and Start the Data Browser server

The Data Browser always runs Gulp tasks first ([gulpfile.js](gulpfile.js)) to generate all the required files related to the client-side and then runs the server. The following command needs to be entered for the same:

``` bash
# Launch the gulp default tasks (CSS, JS, Vendor, Images, Json Configs, ...) + Run the server
npm start
```
If you visit [http://localhost:3000](http://localhost:3000) you should see your Data Browser running locally on your machine!

## Launch GulpJs Tasks only

You can run the Gulp tasks separately without running the server using the following command:

``` bash
gulp
```

Once it is completed, you can see the generated files stored inside of `public/` folder.

_More information on Gulp can be obtained [here](https://gulpjs.com/)._