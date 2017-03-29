/*************************************************************************
* Globals
*********/
var sheet_; //the spreadsheet that is appended to
var SHEET_MAX_ROWS = 50000; //sheet is cleared and starts again
var SHEET_LOG_CELL_WIDTH = 1000; //
var SHEET_LOG_HEADER = 'Message layout: Date Time UTC-Offset MillisecondsSinceInvoked LogLevel Message. Use Ctrl↓ (or Command↓) to jump to the last row';
var DATE_TIME_LAYOUT = 'yyyy-MM-dd HH:mm:ss:SSS Z'; //http://docs.oracle.com/javase/6/docs/api/java/text/SimpleDateFormat.html
var JSON_SPACES = 0; //the number of space characters to use as white space; 

//ref http://docs.oracle.com/javase/7/docs/api/java/util/logging/Level.html
var Level = Object.freeze({
  OFF:    Number.MAX_VALUE,
  SEVERE: 1000,
  WARNING:900,
  INFO:   800,
  CONFIG: 700,
  FINE:   500,
  FINER:  400,
  FINEST: 300,
  ALL: Number.MIN_VALUE});

var level_ = Level.INFO; //set as default. The log level. We log everything this level or greater.
var START_TIME = new Date(); //so we can calculate elapsed time;
var thisApp_ = this;
var counter = 0; 
// If the call to log something has no auth then it can't write to a spreadsheet etc so we use a urlfetch to webapp (remoteLogProxy).
var USE_REMOTE_LOGGER = false; //Default here but evaluated in useSpreadsheet. 

var nativeLogger_ = Logger;

/*************************************************************************
* public methods
*********/

/**
* Allows logging to a Google spreadsheet.
*
* @param  {String} optKey    The spreadsheet key (optional). Defaults to the active spreadsheet if available.
* @param  {String} optSheetName The name of the sheet (optional). Defaults to "Log". The sheet is created if needed.
* @returns {BetterLog} this object, for chaining
*/
function useSpreadsheet(optKey, optSheetName) {
  if (hasAuth_()) {
    setLogSheet_(optKey, optSheetName);
    sheet_.getRange(1,1).setValue(SHEET_LOG_HEADER); //in case we need to update
    rollLogOver_(); //rollover the log if we need to
  } else {
    USE_REMOTE_LOGGER = true;
  }
  return thisApp_;
}

function remoteLogProxy(e) {
  if (e && e.parameter.betterlogmsg) {
    call_(function() {sheet_.appendRow([e.parameter.betterlogmsg]);});
  }
}

/**
* Logs at the SEVERE level. SEVERE is a message level indicating a serious failure.
* In general SEVERE messages should describe events that are of considerable importance and 
* which will prevent normal program execution. They should be reasonably intelligible to end users and to system administrators. 
*
* @param  {Object} message    The message to log or an sprintf-like format string (uses Utilities.formatString() internally - see http://www.perlmonks.org/?node_id=20519 as a good reference).
* @param  {Object...} optValues  If a format string is used in the message, a number of values to insert into the format string.
* @returns {BetterLog} this object, for chaining
*/
function severe(message, optValues) {
  var lev = Level.SEVERE;
  if (isLoggable_(lev)) {
    log_(arguments, lev);
  }
  return thisApp_;
}

/**
* Logs at the WARNING level. WARNING is a message level indicating a potential problem.
* In general WARNING messages should describe events that will be of interest to end users
* or system managers, or which indicate potential problems. 
*
* @param  {Object} message    The message to log or an sprintf-like format string (uses Utilities.formatString() internally - see http://www.perlmonks.org/?node_id=20519 as a good reference).
* @param  {Object...} optValues  If a format string is used in the message, a number of values to insert into the format string.
* @returns {BetterLog} this object, for chaining
*/
function warning(message, optValues) {
  var lev = Level.WARNING;
  if (isLoggable_(lev)) {
    log_(arguments, lev);
  }
  return thisApp_;
}

/**
* Logs at the INFO level. INFO is a message level for informational messages.
* Typically INFO messages will be written to the console or its equivalent. So the INFO level 
* should only be used for reasonably significant messages that will make sense to end users and system administrators. 
<h3>Examples:</h3>
<pre>  
function myFunction() {
&nbsp; //Best practice for using BetterLog and logging to a spreadsheet: 
&nbsp; // You can add and set the property "BetterLogLevel" in File > Project Properties and change it to
&nbsp; // "OFF","SEVERE","WARNING","INFO","CONFIG","FINE","FINER","FINEST" or "ALL" at runtime without editing code.
&nbsp;  Logger = BetterLog.setLevel(ScriptProperties.getProperty('BetterLogLevel')) //defaults to 'INFO' level
&nbsp; .useSpreadsheet('0AhDqyd_bUCmvdDdGczRlX00zUlBMeGNLeE9SNlJ0VGc'); //automatically rolls over at 50,000 rows
  
&nbsp; Logger.log('Messages using Logger.log continue to work');
  
&nbsp; Logger.config('The current log level is %s', Logger.getLevel());
&nbsp; Logger.finer('Entering the "%s" function', arguments.callee.name); //only logged if level is FINER, FINEST or ALL.
    
&nbsp; Logger.info('Starting my function that does stuff');

&nbsp; //Do our work
&nbsp; for (var i = 0; i < 5; i++) {
&nbsp; &nbsp; //do detailed stuff
&nbsp; &nbsp; Logger.finest('Inside the for loop that does the xyz work. i is currently: %d', i);
&nbsp; }

&nbsp; Logger.info('My work is complete and I performed %d iterations', i);
&nbsp; Logger.finer('Returning from the "%s" function', arguments.callee.name);
}
</pre>
*
* @param  {Object} message    The message to log or an sprintf-like format string (uses Utilities.formatString() internally - see http://www.perlmonks.org/?node_id=20519 as a good reference).
* @param  {Object...} optValues  If a format string is used in the message, a number of values to insert into the format string.
* @returns {BetterLog} this object, for chaining
*/
function info(message, optValues) {
  var lev = Level.INFO;
  if (isLoggable_(lev)) {
    log_(arguments, lev);
  }
  return thisApp_;
}

/**
* Logs at the CONFIG level. CONFIG is a message level for static configuration messages.
* CONFIG messages are intended to provide a variety of static configuration information, 
* to assist in debugging problems that may be associated with particular configurations. 
*
* @param  {Object} message    The message to log or an sprintf-like format string (uses Utilities.formatString() internally - see http://www.perlmonks.org/?node_id=20519 as a good reference).
* @param  {Object...} optValues  If a format string is used in the message, a number of values to insert into the format string.
* @returns {BetterLog} this object, for chaining
*/
function config(message, optValues) {
  var lev = Level.CONFIG;
  if (isLoggable_(lev)) {
    log_(arguments, lev);
  }
  return thisApp_;
}

/**
* Logs at the FINE level. FINE is a message level providing tracing information.
* All of FINE, FINER, and FINEST are intended for relatively detailed tracing. 
* The exact meaning of the three levels will vary between subsystems, but in general, 
* FINEST should be used for the most voluminous detailed output, 
* FINER for somewhat less detailed output, and FINE for the lowest volume (and most important) messages.
* 
* In general the FINE level should be used for information that will be broadly interesting to developers
* who do not have a specialized interest in the specific subsystem.
* FINE messages might include things like minor (recoverable) failures. Issues indicating potential performance problems are also worth logging as FINE. T
*
* @param  {Object} message    The message to log or an sprintf-like format string (uses Utilities.formatString() internally - see http://www.perlmonks.org/?node_id=20519 as a good reference).
* @param  {Object...} optValues  If a format string is used in the message, a number of values to insert into the format string.
* @returns {BetterLog} this object, for chaining
*/
function fine(message, optValues) {
  var lev = Level.FINE;
  if (isLoggable_(lev)) {
    log_(arguments, lev);
  }
  return thisApp_;
}

/**
* Logs at the FINER level. FINER indicates a fairly detailed tracing message. 
* By default logging calls for entering, returning, or throwing an exception are traced at this level. 
*
* @param  {Object} message    The message to log or an sprintf-like format string (uses Utilities.formatString() internally - see http://www.perlmonks.org/?node_id=20519 as a good reference).
* @param  {Object...} optValues  If a format string is used in the message, a number of values to insert into the format string.
* @returns {BetterLog} this object, for chaining
*/
function finer(message, optValues) {
  var lev = Level.FINER;
  if (isLoggable_(lev)) {
    log_(arguments, lev);
  }
  return thisApp_;
}

/**
* Logs at the FINEST level. FINEST indicates a highly detailed tracing message. 
*
* @param  {Object} message    The message to log or an sprintf-like format string (uses Utilities.formatString() internally - see http://www.perlmonks.org/?node_id=20519 as a good reference).
* @param  {Object...} optValues  If a format string is used in the message, a number of values to insert into the format string.
* @returns {BetterLog} this object, for chaining
*/
function finest(message, optValues) {
  var lev = Level.FINEST;
  if (isLoggable_(lev)) {
    log_(arguments, lev);
  }
  return thisApp_;
}

/**
* Logs at the INFO level. INFO is a message level for informational messages.
* Typically INFO messages will be written to the console or its equivalent. So the INFO level should
* only be used for reasonably significant messages that will make sense to end users and system administrators. 
*
* @param  {Object} message    The message to log or an sprintf-like format string (uses Utilities.formatString() internally - see http://www.perlmonks.org/?node_id=20519 as a good reference).
* @param  {Object...} optValues  If a format string is used in the message, a number of values to insert into the format string.
* @returns {BetterLog} this object, for chaining
*/
function log(message, optValues) {
  return info.apply(this, arguments);
}

/**
* Sets the new log level
*
* @param  {String} logLevel    The new log level e.g. "OFF","SEVERE","WARNING","INFO","CONFIG","FINE","FINER","FINEST" or "ALL".
* @returns {BetterLog} this object, for chaining
*/
function setLevel(logLevel) {
  if (typeof logLevel === "string") {
    var logLevel = stringToLevel_(logLevel);
  }
  if (logLevel != getLevel_()) {
    setLevel_(logLevel);
  }
  return thisApp_;
}
/**
* Gets the current log level name
*
* @returns {String} The name of the current log level e.g. "OFF","SEVERE","WARNING","INFO","CONFIG","FINE","FINER","FINEST" or "ALL".
*/
function getLevel() {
  return levelToString_(getLevel_());
}

/*************************************************************************
* @private functions
********************/

//in custom function, you do not have permission to call getActiveUser
function hasAuth_() {
  try {
    Session.getActiveUser();
    return true;
  } catch (e) {
    return false; 
  }
}

// Returns the string as a Level.
function stringToLevel_(str) {
  for (var name in Level) {
    if (name == str) {
      return Level[name];
    } 
  } 
}

// Returns the Level as a String
function levelToString_(lvl) {
  for (var name in Level) {
    if (Level[name] == lvl)
      return name;
  } 
}

//gets the current logging level
function getLevel_() {
  return level_;
}

//sets the current logging level
function setLevel_(lvl) {
  for (var name in Level) {
    if (Level[name] == lvl) {
      level_ = lvl;
      info("Log level has been set to " +  getLevel());
      break;
    }
  }
}

//checks to see if this level is enabled
function isLoggable_(Level) {
  if (getLevel_()<=Level) {
    return true;
  }
  return false;
}

//core logger function
function log_(msgArgs, level) {
  counter++;
  
  // get args and transform objects to strings like the native logger does.
  var args = Array.prototype.slice.call(msgArgs).map(function(e){
    var type = typeof e;
    if (type === 'undefined') return 'undefined';
    return e !== null && type === 'object' ? JSON.stringify(e, null, JSON_SPACES) : e;
  });
  
  var msg =  (typeof msgArgs[0] == 'string' || msgArgs[0] instanceof String) ? Utilities.formatString.apply(this, args) : msgArgs[0];  
  
  //default console logging (built in with Google Apps Script's View > Logs...)
  nativeLogger_.log(convertUsingDefaultPatternLayout_(msg, level));
  //ss logging
  if (sheet_) {
    logToSheet_(msg, level);
  }
}

//  rolls over the log if we need to
function rollLogOver_() {
  var rowCount = call_(function() {return sheet_.getLastRow();});
  if (rowCount > SHEET_MAX_ROWS) {
    
    // get a lock or throw exception
    var lock = LockService.getScriptLock();
    lock.waitLock(10000); //try for 10 secs to get a lock, long enough to rollover the log
    
    //copy the log
    var ss = sheet_.getParent();
    var oldLog = ss.copy(ss.getName() + ' as at ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), DATE_TIME_LAYOUT));
    
    //add current viewers and editors to old log
    oldLog.addViewers(ss.getViewers());
    oldLog.addEditors(ss.getEditors());
    
    // prep the live log
    sheet_.deleteRows(2, sheet_.getMaxRows()-2);
    sheet_.getRange(1,1).setValue(SHEET_LOG_HEADER);
    
    //update the log
    sheet_.getRange("A2").setValue(['Log reached ' + rowCount + ' rows (MAX_ROWS is ' + SHEET_MAX_ROWS + ') and was cleared. Previous log is available here:']);
    sheet_.appendRow([oldLog.getUrl()]);
    
    //release lock 
    lock.releaseLock();
  }
}

//logs to spreadsheet
function logToSheet_(msg, level) {
  //check for rollover every 100 rows logged during one invocation
  if (counter % 100 === 0) {
    rollLogOver_();
  }
  var message = convertUsingSheetPatternLayout_(msg, level);
  if (USE_REMOTE_LOGGER) {
    var url = ScriptApp.getService().getUrl()+'?betterlogmsg='+message;
    call_(function() {UrlFetchApp.fetch(url);});
  } else {
    call_(function() {sheet_.appendRow([message]);});
  }
}
// convert message to text string
function convertUsingDefaultPatternLayout_(msg, level) {
  var now = new Date;
  var dt = Utilities.formatDate(now, Session.getScriptTimeZone(), DATE_TIME_LAYOUT);
  var message = dt + " " + pad_(now - START_TIME, 6) + " " + levelToString_(level) + " " + (USE_REMOTE_LOGGER ? 'REMOTE ': '') + msg;
  return message;
}
// convert message to text string
function convertUsingSheetPatternLayout_(msg, level) {
  return convertUsingDefaultPatternLayout_(msg, level);
}
//Sets the log sheet, creating one if it doesn't exist
function setLogSheet_(optKey, optSheetName) {
  var sheetName = optSheetName || "Log";
  var ss = (optKey) ? SpreadsheetApp.openById(optKey) : SpreadsheetApp.getActiveSpreadsheet();
  var sheets = call_(function() {return ss.getSheets();});
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName() === sheetName) {
      sheet_ = sheets[i];
      return;
    }
  }
  sheet_ = ss.insertSheet(sheetName, i);
  sheet_.deleteColumns(2,sheet_.getMaxColumns()-1);
  sheet_.getRange(1,1).setValue(SHEET_LOG_HEADER);
  sheet_.setFrozenRows(1);
  sheet_.setColumnWidth(1, SHEET_LOG_CELL_WIDTH);
  info("Log created");
}

// pads a number with leading zeros
function pad_(n,len) {
  var s = n.toString();
  if (s.length < len) {
    s = ('0000000000' + s).slice(-len);
  } 
  return s;
}

function test(message, optValues) {
  var lev = Level.INFO;
  if (isLoggable_(lev)) {
    log_(arguments, lev);
  }
  return thisApp_;
}

//copy version 10 lib GASRetry 'MGJu3PS2ZYnANtJ9kyn2vnlLDhaBgl_dE' (changed function name and log line)
function call_(func, optLoggerFunction) {
  for (var n=0; n<6; n++) {
    try {
      return func();
    } catch(e) {
      if (optLoggerFunction) {optLoggerFunction("call_ " + n + ": " + e)}
      if (n == 5) {
        throw e;
      } 
      Utilities.sleep((Math.pow(2,n)*1000) + (Math.round(Math.random() * 1000)));
    }    
  }
}
