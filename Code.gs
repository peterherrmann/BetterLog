Logger = BetterLog.useSpreadsheet('1k2cPOWj8g-NekbINijAGbxQDk2cG2h9kC-I-KOgkDOE');

function myFunction() {
  try{
    // Add one line to use BetterLog and log to a spreadsheet
    Logger = BetterLog.useSpreadsheet('your-spreadsheet-key-goes-here'); 
    
    //Now you can log and it will also log to the spreadsheet
    Logger.log("That's all you need to do");  
    
    //Do more logging
    for (var i = 0; i < 5; i++) {
      var processingMessage = 'Processing ' + i;
      Logger.finest('This is inside my loop. i is %s', i );
    }
    //We're done
    Logger.log('The loop is done and i is now %s', i );
    
  } catch (e) { //with stack tracing if your exceptions bubble up to here
    e = (typeof e === 'string') ? new Error(e) : e;
    Logger.severe('%s: %s (line %s, file "%s"). Stack: "%s" . While processing %s.',e.name||'', 
               e.message||'', e.lineNumber||'', e.fileName||'', e.stack||'', processingMessage||'');
    throw e;
  }
}

// The code above is screenshotted in the doc on Script Examples - https://sites.google.com/site/scriptsexamples/custom-methods/betterlog



function myFunction1() {
  try {
    var config = SettingsManager.load('0AhDqyd_bUCmvdDdGczRlX00zUlBMeGNLeE9SNlJ0VGc');
    //Best practice for using BetterLog and logging to a spreadsheet: //MYB7yzedMbnJaMKECt6Sm7FLDhaBgl_dE
    // You can add and set the property "BetterLogLevel" in File > Project Properties and change it to
    // "OFF","SEVERE","WARNING","INFO","CONFIG","FINE","FINER","FINEST" or "ALL" at runtime without editing code.
    Logger = BetterLog.setLevel(config.logLevel.value).useSpreadsheet(config.logSpreadsheetId.value); 
    
    Logger.log('Messages using Logger.log will continue to work');
    
    //var x = config.Nonexist.value; //error 
    
    Logger.config('The current log level is %s', Logger.getLevel());
    Logger.finer('Entering the "%s" function', arguments.callee.name); //only logged if level is FINER, FINEST or ALL.
    
    Logger.info('Starting my function that does stuff');
    
    // Do our work
    for (var i = 0; i < 5; i++) {
      //do detailed stuff
      Logger.finest('Inside the for loop that does the xyz work. i is currently: %d', i);
    }
    Logger.info('My work is complete and I performed %d iterations', i);
    Logger.finer('Returning from the "%s" function', arguments.callee.name);
    
    subtest();
  } catch (e) {
    //var mye = e;
    Logger.severe('%s: %s (line %s, file "%s"). Stack: "%s" ',e.name, e.message, e.lineNumber, e.fileName, e.stack);
    throw e;
  }
}

function testException() {
  try {
    var config = SettingsManager.load('0AhDqyd_bUCmvdDdGczRlX00zUlBMeGNLeE9SNlJ0VGc');
    Logger = BetterLog.setLevel(config.logLevel.value).useSpreadsheet(config.logSpreadsheetId.value);
    Logger.info('Testing exception - watch next line');
    var processingMessage = 'some item being processed';
    //var x = SpreadsheetApp.openById("jhgjhg");
    //throw new Error("this is a test exception");
    throw "test str";
  } catch (e) {
    var t = typeof e;
    e = (typeof e === 'string') ? new Error(e) : e;
    var mye = e;
    Logger.severe('%s: %s (line %s, file "%s"). Stack: "%s" . While processing %s.',e.name, e.message, e.lineNumber, e.fileName, e.stack||'', processingMessage);
    throw e;
  }
  
}

function logNoTimeStamp() {
  
  Logger = BetterLog.useSpreadsheet('0AhDqyd_bUCmvdDdGczRlX00zUlBMeGNLeE9SNlJ0VGc');
  
  //var DATE_TIME_LAYOUT = 'yyyy-MM-dd HH:mm:ss:SSS Z'; //http://docs.oracle.com/javase/6/docs/api/java/text/SimpleDateFormat.html
  Logger.DATE_TIME_LAYOUT = 'yyyy-MM-dd';
  Logger.DATE_TIME_LAYOUT = "''";  
  Logger.log('Look no timestamp!');
  
}


function testMultiLog() {
  
  //DOES NOT WORK - all are the same object id
  
  Logger1 = new BetterLog1.useSpreadsheet('0AhDqyd_bUCmvdDdGczRlX00zUlBMeGNLeE9SNlJ0VGc'); //"BetterLog test settings and log"
  Logger1.log('This is logging to the first');
  
  Logger2 = new BetterLog2.useSpreadsheet('16XbT6wwfnupMEJyVT8Xoi2jT7EB8S57FY7v7n0xcrcg'); //"BetterLog Test 2"
  Logger2.log('This is logging to the second');
  
  Logger1.log('This is logging to the first again');
  debugger;
  Logger3 = new BetterLog3.useSpreadsheet('1pzPlHyx4qoLuyqHOuxO1t1cUjoWyU4J11duNCMr7uKs'); //"BetterLog Test 3"
  Logger3.log('This is logging to the third');
  
  Logger2.log('This is logging to the second again');
  
  Logger1.log('This is logging to the first again');
  debugger;
}

function subtest() {
  Logger.log("Sub test");
  //var x = config.Nonexist.value; //error 
}
function testRollover() {
  Logger = BetterLog.useSpreadsheet('0AhDqyd_bUCmvdDdGczRlX00zUlBMeGNLeE9SNlJ0VGc');
  Logger.SHEET_MAX_ROWS = 100;
  var MAX = 105,
      i = 0;
  for (i = 0; i <MAX; i++) {
    Logger.log('This is log message number %s of %s', i,MAX);
  }
}
function testZero() {
  Logger = BetterLog.useSpreadsheet('0AhDqyd_bUCmvdDdGczRlX00zUlBMeGNLeE9SNlJ0VGc');
  Logger.log(999);
  Logger.log('test');
  Logger.log('Start this test %s', 123);
  Logger.test('Start this test %s', 1, 2);
  Logger.test('This is zero: %s',0);
  Logger.test('This is zero: %s this is ten: %s',0,10);
  //Logger.test(Number.MAX_VALUE);
  //Utilities.formatString(Number.MAX_VALUE);
 // Logger.log(Utilities.formatString(Number.MAX_VALUE));  */
}

function test100() {
  Logger = BetterLog.useSpreadsheet('0AhDqyd_bUCmvdDdGczRlX00zUlBMeGNLeE9SNlJ0VGc');
  //Logger = BetterLog;
  var MAX = 100;
  for (var i = 0; i <MAX; i++) {
    Logger.log('This is log message number %s of %s', i,MAX);
  }
}
function test1000() {
  var MAX = 1000;
  BetterLog.useSpreadsheet('0AhDqyd_bUCmvdDdGczRlX00zUlBMeGNLeE9SNlJ0VGc');
  Logger = BetterLog;
  for (var i = 0; i <MAX; i++) {
    Logger.log('This is log message number %s of %s', i,MAX);
  }
}
function test100000() {
  var MAX = 100000;
  BetterLog.useSpreadsheet('0AhDqyd_bUCmvdDdGczRlX00zUlBMeGNLeE9SNlJ0VGc');
  Logger = BetterLog;
  for (var i = 0; i <MAX; i++) {
    Logger.log('This is log message number %s of %s', i,MAX);
  }
}
function tests() {
  // test with library
  Logger = BetterLog.useSpreadsheet('1k2cPOWj8g-NekbINijAGbxQDk2cG2h9kC-I-KOgkDOE');
  // test with locallyCopied... (rename the lib xBetterLog in Resources > Libraries
  //Logger = useSpreadsheet('1k2cPOWj8g-NekbINijAGbxQDk2cG2h9kC-I-KOgkDOE'); 
  
  //Log some stuff
  Logger.log("Starting message");
  
  Logger.setLevel('FINEST');
  Logger.setLevel('kuhkh');
  Logger.setLevel(987987987);
  Logger.setLevel('ALL');
  // Logger.setLevel('NONE');
  Logger.log('Starting test *************************************');
  Logger.log();
  Logger.log(null);
  Logger.log("This is a : %s", undefined);
  Logger.log("hello");
  Logger.log(Number.MAX_VALUE);
  Logger.log([1,2,3]);
  
  
  Logger.log("test1 %s", 44);
  var c = 55;
  Logger.log("test2 %s", c);
  Logger.log("test3 %03d", 7);
  Logger.log('test4 %s %s %s', 'one', 2, 'three');
  Logger.log('test5 at %s', new Date());  
  Logger.log('test6 at %s at %s', new Date(), 99);
  Logger.log('test7 here is an array: %s', [1,2,3]); 
  var test8 = Logger.log('test8 big %s', Number.MAX_VALUE);
  for (var i = 0; i < 10; i++) {
    //  Logger.log('test9 this is message number %s', i);
  }
  
  //
  Logger.severe('test10 is severe')
  .warning('warning')
  .info('info')
  .config('config')
  .fine('fine')
  .finer('finer')
  .finest('finest')
  .log('log');
  
  Logger.log('%d %s %s %s', undefined|'', '', undefined|'', "hello");
  var a = 7;
  var b = 9;
  var c  = {firstDog: "Chester", secondDog: "Marais", lastWinner: 2};
  Logger.log("a=%s, b=%s, c=%s", a, b, c);
  
  // TODO: line 309, if arg(0) is string then also use formatstring
  Logger.log({myKey:"My Value"});
  Logger.log({myKey:"%s"},987);  //expected NOT to replace
  
  //  test cloudlogging example from https://developers.google.com/apps-script/guides/logging
   var parameters = {
      isValid: true,
      content: 'some string',
      timestamp: new Date()
  };
  //console.log({message: 'Function Input', initialData: parameters});
  Logger.log({message: 'Function Input', initialData: parameters});    
  return;
  var theend = 'test';
  
}

function testThrows() {
  var processingMessage = '';
  try {
    throw ErrorService.createScriptError('testscripterror');
    //throw new Error("testoops"); //works
    //throw "teststringooops"; no line number even if instatiated with error in catch
    //test.problem(); works 
  } catch (e) {
    e = (typeof e === 'string') ? new Error(e) : e;
    Logger.severe('%s. While processing %s', JSON.stringify(e, null, 2), processingMessage);
    throw e;
  }
}