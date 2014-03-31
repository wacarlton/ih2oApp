(function (global) {
    var MeterViewModel,
        app = global.app = global.app || {};

    MeterViewModel = kendo.data.ObservableObject.extend({
        hasMeterData: false,
        meterId: "",

        onSubmit: function () {
            var that = this,
                meterId = that.get("meterId").trim();

            if (meterId === "") {
                navigator.notification.alert("Meter Id Required!",
                    function () { }, "Fetching Details failed", 'OK');

                return;
            }
            $.ajax({
                type: 'GET',
                url: 'http://qa.intellih2o.com/swma/mi/' + meterId,
                dataType: 'jsonp',
                success: function(data) {
                    that.set("meterId", data.meter.meterId);      
                    $('#meterDataId').text(data.meter.meterId);
                    $('#meterDataAddress').text(data.customer.address);
                    $('#meterDataVolume').text(data.meter.totalVolume);
                    $('#meterDataTemperature').text(data.meter.temperatureInFahrenheit );
                    $('#meterDataPressure').text(data.meter.pressure);
                    $('#meterDataValve').text(data.meter.valveStatus);
                    if (data.meter.valveStatus == "Open") {
                        $("#valveSwitch").data("kendoMobileSwitch").check(true)
                    } else {
                        $("#valveSwitch").data("kendoMobileSwitch").check(false)
                    }
                    $('#meterDataLat').text(data.meter.lat);
                    $('#meterDataLng').text(data.meter.lng);
                    that.set("hasMeterData", true);
                },
                error: function(e) {
                   alert(e);
                }
            });

            
        },

        onScan: function () {         
            var that = this;
            if (window.navigator.simulator === true) {
                alert("Not Supported in Simulator.");
            }
            else {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (!result.cancelled) {                             
                            var fmt = result.format;
                            var meterId = result.text;
                            that.set("meterId", meterId);
                            that.onSubmit();    
                        }
                    },
                    function (error) {
                        console.log("Scanning failed: " + error);
                    });
            }
       },
        
        onClear: function () {
            var that = this;
            app.application.scroller().reset();
			that.clearForm();
            that.set("hasMeterData", false);
        },
        

        clearForm: function () {
            var that = this;

            that.set("meterId", "");
        },

        checkEnter: function (e) {
            var that = this;

            if (e.keyCode == 13) {
                $(e.target).blur();
                that.onSubmit();
            }
        }
    });

    app.meterService = {
        viewModel: new MeterViewModel()
    };
})(window);

function meterDataViewSelect() {
    var meterDataViews = this.element.parent().find(".meterdata");
    meterDataViews.hide().eq(this.selectedIndex).show();
}

function valveChange(e) {
    var meterId = app.meterService.viewModel.meterId;
    var action = e.checked ? "open" : "close";
    $.ajax({
        type: 'GET',
        url: 'http://qa.intellih2o.com/swma/valve/' + meterId + '/' + action, 
        dataType: 'jsonp',
        success: function(data) {
            navigator.notification.alert("Valve " + action + " command is queued!",
                    function () { }, "The operation will finish in a few minutes.", 'OK');
        },
        error: function(e) {
            navigator.notification.alert("Valve " + action + " operation failed!",
                    function () { }, "Please try later.", 'OK');
        }
    });
}