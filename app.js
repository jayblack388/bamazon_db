require('dotenv').config();
const keys = require("./keys");
const mysql = require("mysql");
const pw = keys.password.pw;
const inquirer = require("inquirer");
const {con, testConnect} = require("./utils");