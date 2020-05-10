                                        function JSAresult(qdbdata) {
  eval(qdbdata);
  this.numcols = qdb_numcols;
  this.numrows = qdb_numrows;
  this.heading = qdb_heading.slice();
  if (qdb_numrows > 0) {
    this.data = qdb_data.slice();
  }
}

function apGetURL(urlpath, params) {
  var xmlhttp = false;

  var urlget = urlpath + "?" + params;
  try {
    xmlhttp = new ActiveXObject('Msxml2.XMLHTTP'); //Try the first kind of active x object?
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject('Microsoft.XMLHTTP'); //Try the second kind of active x object
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
    xmlhttp = new XMLHttpRequest(); //If we were able to get a working active x object, start an XMLHttpRequest
  }
  var getrequest = xmlhttp.open("GET", urlget, false);
 //var postrequest = xmlhttp.open("POST", urlpath ,false);
  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 //xmlhttp.send(params);
  xmlhttp.send();

  return xmlhttp.responseText;
}

function post_single_record(fieldxml, rid, dbid) {
// Get an XML Request Object...

  log("************** entering post_single_record");
  var xmlhttp = false;
  try {
        xmlhttp = new ActiveXObject('Msxml2.XMLHTTP'); //Try the first kind of active x objectâ€&brkbar;
  } catch (e) {
        try {
          xmlhttp = new ActiveXObject('Microsoft.XMLHTTP'); //Try the second kind of active x object
        } catch (E) {
          xmlhttp = false;
        }
  }

  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
        xmlhttp = new XMLHttpRequest(); //If we were able to get a working active x object, start an XMLHttpRequest
  } 
  
  var posturl = dbid + "";  
  xmlhttp.open("POST", posturl, false);
  xmlhttp.setRequestHeader("Content-Type", "application/xml");
  
  xmldata = "<qdbapi>\n";  
  if (rid == "") {
    xmlhttp.setRequestHeader("QUICKBASE-ACTION", "API_AddRecord");
  } else {
    xmlhttp.setRequestHeader("QUICKBASE-ACTION", "API_EditRecord");
    xmldata += "<rid>" + rid + "</rid>\n";
  }      
  //xmldata += "<apptoken>bgn7mb5s4wfhhc3ykyhib8byj29</apptoken>\n";
  xmldata += fieldxml + "\n";
  xmldata += "</qdbapi>";

  log("data being posted is " + xmldata);

  xmlhttp.send(xmldata);

  var resp = xmlhttp.responseText;
  //log("response from post is " + resp);
  //alert("caught error in single record post-> " + err)
  //alert("data saved");
  //log("exiting post_single_record**************");
  return resp;
}


function post_csv(csvstr, clist, dbid, apptok) {
// Get an XML Request Object...
  log("************** entering post_csv");
  var xmlhttp = false;
  try {
        xmlhttp = new ActiveXObject('Msxml2.XMLHTTP'); //Try the first kind of active x objectâ€&brkbar;
  } catch (e) {
        try {
          xmlhttp = new ActiveXObject('Microsoft.XMLHTTP'); //Try the second kind of active x object
        } catch (E) {
          xmlhttp = false;
        }
  }
  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
        xmlhttp = new XMLHttpRequest(); //If we were able to get a working active x object, start an XMLHttpRequest
  } 
  
  var posturl = dbid + "";  
  xmlhttp.open("POST", posturl, false);
  xmlhttp.setRequestHeader("Content-Type", "application/xml");

  xmlhttp.setRequestHeader("QUICKBASE-ACTION", "API_ImportFromCSV");
  var xmldata = "<qdbapi>";  
  xmldata += "<records_csv>";
  xmldata += "<![CDATA["+csvstr+"]]></records_csv>";
  xmldata += "<clist>"+clist+"</clist>";
  xmldata += "<skipfirst>1</skipfirst>";
  xmldata += "<apptoken>"+apptok+"</apptoken>";
  xmldata += "</qdbapi>";

  log("data being posted is " + xmldata);

  xmlhttp.send(xmldata);

  var resp = xmlhttp.responseText;
  //log("response from post is " + resp);
  //alert("caught error in single record post-> " + err)
  //alert("data saved");
  //log("exiting post_single_record**************");
  return resp;
}

var PageTitleNotification = {
    Vars:{
        OriginalTitle: document.title,
        Interval: null
    },    
    On: function(notification, intervalSpeed){
        var _this = this;
        _this.Vars.Interval = setInterval(function(){
             document.title = (_this.Vars.OriginalTitle == document.title)
                                 ? notification
                                 : _this.Vars.OriginalTitle;
        }, (intervalSpeed) ? intervalSpeed : 1000);
    },
    Off: function(){
        clearInterval(this.Vars.Interval);
        document.title = this.Vars.OriginalTitle;   
    }
}

//grab simple xml value
function grabXMLval(fldname,xmlstring) {
  var t0 = xmlstring.indexOf("<"+fldname) + fldname.length + 2;
  var t1 = xmlstring.indexOf("</"+fldname + ">");
  return xmlstring.substring(t0,t1);
} 

//grab simple xml attribute
function grabXMLattr2(fldname,attrname,xmlstring) {
log("grabXMLattr called")
  var t0 = xmlstring.indexOf("<"+fldname+">") + fldname.length + 2;
  var t1 = xmlstring.indexOf("</"+fldname + ">");
  var fldstr = xmlstring.substring(t0,t1);
log("t0 " + t0 + ", t1 " + t1 + ", fldstr " + fldstr);  
  t1 = fldstr.indexOf(">");
  var attrstr = fldstr.substring(0,t1);
log("t1 " + t1 + ", attrstr " + attrstr);  
  var attrs = attrstr.split(" ");
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i].split("=");
    if (attr[0] == attrname) {
      var attrval = attr[1].substring(1,attr.length-1);
      log ("found attribute " + attrname + ", " + attrval);    
    }
  }
  return "";   
} 

function log(message) {
        if (debuglog  == "yes") {
                if (!log.window_ || log.window_.closed) {
                    var win = window.open("", "_qb_debug", "width=900,height=600,scrollbars=yes,resizable=yes,status=no,location=no,menubar=no,toolbar=no");
                    if (!win) return;
                    var doc = win.document;
                    doc.write("<html><head><title>Debug Log</title></head><body style='font-size:12px; font-style: sans-serif'></body></html>");
                    doc.close();
                    log.window_ = win;
                }
                var logLine = log.window_.document.createElement("div");
                logLine.appendChild(log.window_.document.createTextNode(message));
                log.window_.document.body.appendChild(logLine);
        }
}


    function handleContactIncoming(contact) {
        if (contact) {
            logInfoEvent("[contact.onIncoming] Contact is incoming. Contact state is " + contact.getStatus().type);
        } else {
            logInfoEvent("[contact.onIncoming] Contact is incoming. Null contact passed to event handler");
        }
    }

    function handleContactAccepted(contact) {
        if (contact) {
            logInfoEvent("[contact.onAccepted] Contact accepted by agent. Contact state is " + contact.getStatus().type);
        } else {
            logInfoEvent("[contact.onAccepted] Contact accepted by agent. Null contact passed to event handler");
        }
    }

    function handleContactConnected(contact) {
        if (contact) {
            logInfoEvent("[contact.onConnected] Contact connected to agent. Contact state is " + contact.getStatus().type);
        } else {
            logInfoEvent("[contact.onConnected] Contact connected to agent. Null contact passed to event handler");
        }
    }

    function handleContactEnded(contact) {
        if (contact) {
            logInfoEvent("[contact.onEnded] Contact has ended. Contact state is " + contact.getStatus().type);
        } else {
            logInfoEvent("[contact.onEnded] Contact has ended. Null contact passed to event handler");
        }
    }

    function subscribeToAgentEvents_old(agent) {
        logInfoMsg("Subscribing to events for agent " + agent.getName());
        logInfoMsg("Agent is currently in status of " + agent.getStatus().name);
        agent.onRefresh(handleAgentRefresh);
        agent.onRoutable(handleAgentRoutable);
        agent.onNotRoutable(handleAgentNotRoutable);
        agent.onOffline(handleAgentOffline);
    }

    function handleAgentRefresh(agent) {
        logInfoEvent("[agent.onRefresh] Agent data refreshed. Agent status is " + agent.getStatus().name);
    }

    function handleAgentRoutable(agent) {
        logInfoEvent("[agent.onRoutable] Agent is routable. Agent status is " + agent.getStatus().name);
    }

    function handleAgentNotRoutable(agent) {
        logInfoEvent("[agent.onNotRoutable] Agent is online, but not routable. Agent status is " + agent.getStatus().name);
    }

    function handleAgentACW(agent) {
        logInfoEvent("[agent.onNotRoutable] Agent is after call work, but not routable. Agent status is " + agent.getStatus().name);
    }

    function handleAgentOffline(agent) {
        logInfoEvent("[agent.onOffline] Agent is offline. Agent status is " + agent.getStatus().name);
    }

    function logMsgToScreen(msg) {
        logMsgs.innerHTML = '<div>' + new Date().toLocaleTimeString() + ' ' + msg + '</div>' + logMsgs.innerHTML;
    }

    function logEventToScreen(msg) {
        eventMsgs.innerHTML = '<div>' + new Date().toLocaleTimeString() + ' ' + msg + '</div>' + eventMsgs.innerHTML;
    }

    function logInfoMsg(msg) {
        connect.getLog().info(msg);
        logMsgToScreen(msg);
    }

    function logInfoEvent(eventMsg) {
        connect.getLog().info(eventMsg);
        logEventToScreen(eventMsg);
    }


 



