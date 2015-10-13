
(function () {

    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var app;

    // create an object to store the models for each view
    window.APP = {
      models: {
        home: {
          title: 'Home',
          initalize: InitializeGauge
        },
        settings: {
          title: 'Settings',
          initalize: InitializeGrid
        },
        contacts: {
          title: 'Contacts',
          ds: new kendo.data.DataSource({
              data: [{ id: 1, name: 'Bob' }, { id: 2, name: 'Mary' }, { id: 3, name: 'John' }, { id: 4, name: 'Shilpa'}]
          }),
          alert: function(e) {
            alert(e.data.name);
          }
        }
      }
    };


    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {  
      
      // hide the splash screen as soon as the app is ready. otherwise
      // Cordova will wait 5 very long seconds to do it for you.
      navigator.splashscreen.hide();

      app = new kendo.mobile.Application(document.body, {
        
        // you can change the default transition (slide, zoom or fade)
        transition: 'slide',
        
        // comment out the following line to get a UI which matches the look
        // and feel of the operating system
        skin: 'flat',

        // the application needs to know which view to load first
        initial: 'views/home.html'
      });

    }, false);


} ());


function InitializeGrid() {

    var hubUrl = "http://demos.telerik.com/kendo-ui/service/signalr/hubs";
    var connection = $.hubConnection(hubUrl, { useDefaultPath: false });
    var hub = connection.createHubProxy("productHub");
    var hubStart = connection.start({ jsonp: true });

    hubStart.done(function () {
        $("#grid").kendoGrid({
            dataSource: {
                transport: {
                    push: function (callbacks) {
                        hub.on("create", function (result) {
                            console.log("push create");
                            callbacks.pushCreate(result);
                        });
                        hub.on("update", function (result) {
                            console.log("push update");
                            callbacks.pushUpdate(result);
                        });
                        hub.on("destroy", function (result) {
                            console.log("push destroy");
                            callbacks.pushDestroy(result);
                        });
                    },
                    read: function (options) {
                        hub.invoke("read", { type: "read" }).done(function (result) {
                            options.success(result);
                        });
                    },
                    update: function (options) {
                        hub.invoke("update", options.success);
                    },
                    destroy: function (options) {
                        hub.invoke("destroy", options.success);
                    },
                    create: function (options) {
                        hub.invoke("create", options.success);
                    }
                },
                schema: {
                    model: {
                        fields: {
                            ProductName: { type: "string" },
                            UnitPrice: { type: "number" },
                            UnitsInStock: { type: "number" },
                            Discontinued: { type: "boolean" }
                        }
                    }
                }
            },
            height: 550,
            scrollable: true,
            sortable: true,
            filterable: true,
            pageable: {
                input: true,
                numeric: false
            },
            columns: [
                           "ProductName",
                           { field: "UnitPrice", title: "Unit Price", format: "{0:c}", width: "130px" },
                           { field: "UnitsInStock", title: "Units In Stock", width: "130px" },
                           { field: "Discontinued", width: "130px" }
                       ]
        });
    });
}



function InitializeGridWithIssues() {
    var hubUrl = "http://demos.telerik.com/kendo-ui/service/signalr/hubs";
    var connection = $.hubConnection(hubUrl, { useDefaultPath: false });
    var hub = connection.createHubProxy("productHub");
    var hubStart = connection.start({ jsonp: true });

    $("#grid").kendoGrid({
        dataSource: {
            data: products,
//            transport: {
//                push: function (callbacks) {
//                    //                    hub.on("create", function (result) {
                    //                        console.log("push create");
                    //                        callbacks.pushCreate(result);
                    //                    });
                    //                    hub.on("update", function (result) {
                    //                        console.log("push update");
                    //                        callbacks.pushUpdate(result);
                    //                    });
                    //                    hub.on("destroy", function (result) {
                    //                        console.log("push destroy");
                    //                        callbacks.pushDestroy(result);
                    //                    });
//                }
//            },
            schema: {
                model: {
                    fields: {
                        ProductName: { type: "string" },
                        UnitPrice: { type: "number" },
                        UnitsInStock: { type: "number" },
                        Discontinued: { type: "boolean" }
                    }
                }
            },
            pageSize: 20
        },
        height: 550,
        scrollable: true,
        sortable: true,
        filterable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
                            "ProductName",
                            { field: "UnitPrice", title: "Unit Price", format: "{0:c}", width: "130px" },
                            { field: "UnitsInStock", title: "Units In Stock", width: "130px" },
                            { field: "Discontinued", width: "130px" }
                        ]
    });
}


function InitializeGauge() {

    //var value = $("#gauge-value").val();
    //var dashboard = io('localhost:3000/dashboard')
    $("#gauge").kendoLinearGauge({
        pointer: {
            value: 10
        },

        scale: {
            majorUnit: 20,
            minorUnit: 2,
            min: -40,
            max: 60,
            vertical: true,
            ranges: [
                          {
                              from: -40,
                              to: -20,
                              color: "#2798df"
                          }, {
                              from: 30,
                              to: 45,
                              color: "#ffc700"
                          }, {
                              from: 45,
                              to: 60,
                              color: "#c20000"
                          }
                      ]
        }
    });
}

function InitializeWebSocketBasedGrid() {
    if (typeof WebSocket === "undefined") {
        $("#grid").html('This demo requires <a href="http://en.wikipedia.org/wiki/WebSocket">WebSocket</a> support.<a href="http://updateyourbrowser.net/" title="Update Your Browser"><img src="http://updateyourbrowser.net/uyb.jpg" border="0" alt="Update Your Browser" /></a>');
        return;
    }

    var host = "wss://kendoui-ws-demo.herokuapp.com";
    var ws = new WebSocket(host);

    //Bind the grid when the socket connects
    //        ws.onopen = function () {
    //            $("#grid").data("kendoGrid").dataSource.fetch();
    //        };

    //Close the socket when the browser window is closed.
    window.onbeforeunload = function () {
        ws.close();
    }

    //Helper function to send data through the socket
    function send(ws, request, callback) {
        if (ws.readyState != 1) {
            alert("Socket was closed. Please reload the page.");
            return;
        }

        //Assign unique id to the request. Will use that to distinguish the response.
        request.id = kendo.guid();

        //Listen to the "message" event to get server response
        ws.addEventListener("message", function (e) {
            var result = JSON.parse(e.data);

            //Check if the response is for the current request
            if (result.id == request.id) {
                //Stop listening
                ws.removeEventListener("message", arguments.callee);

                //Invoke the callback with the result
                callback(result);
            }
        });

        //Send the data to the server
        ws.send(JSON.stringify(request));
    }

    $("#notification").kendoNotification({
        width: "100%",
        position: {
            top: 0,
            left: 0
        }
    });

    $("#grid").kendoGrid({
        height: 550,
        autoBind: false,
        editable: true,
        sortable: true,
        columns: [
                    { field: "UnitPrice" },
                    { field: "ProductName" },
                    { command: "destroy", width: 150 }
                ],
        toolbar: ["create"],
        dataSource: {
            // Handle the push event to display notifications when push updates arrive
            push: function (e) {
                var notification = $("#notification").data("kendoNotification");
                notification.success(e.type);
            },
            autoSync: true,
            schema: {
                model: {
                    id: "ProductID",
                    fields: {
                        "ProductID": { editable: false, nullable: true },
                        "CreatedAt": { type: "date" },
                        "UnitPrice": { type: "number" }
                    }
                },
                data: "data"
            },
            sort: [{ field: "CreatedAt", dir: "desc"}],
            transport: {
                push: function (options) {
                    //Listen to the "message" event fired when the server pushes data
                    ws.addEventListener("message", function (e) {
                        var result = JSON.parse(e.data);

                        //Check what the push type is and invoke the corresponding callback.
                        if (result.type == "push-update") {
                            options.pushUpdate(result);
                        } else if (result.type == "push-destroy") {
                            options.pushDestroy(result);
                        } else if (result.type == "push-create") {
                            options.pushCreate(result);
                        }
                    });
                },
                read: function (options) {
                    var request = { type: "read" };

                    send(ws, request, function (result) {
                        options.success(result);
                    });
                },
                update: function (options) {
                    var request = { type: "update", data: [options.data] };

                    send(ws, request, options.success);
                },
                destroy: function (options) {
                    var request = { type: "destroy", data: [options.data] };

                    send(ws, request, options.success);
                },
                create: function (options) {
                    var request = { type: "create", data: [options.data] };

                    send(ws, request, options.success);
                }
            }
        }
    });
}
