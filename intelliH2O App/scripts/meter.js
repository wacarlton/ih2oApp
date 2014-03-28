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
                    $('#meterDataId').text(data.meter.meterId);
                    $('#meterDataAddress').text(data.customer.address);
                    $('#meterDataVolume').text(data.meter.totalVolume);
                    $('#meterDataTemperature').text(data.meter.temperatureInFahrenheit );
                    $('#meterDataPressure').text(data.meter.pressure);
                    $('#meterDataValve').text(data.meter.valveStatus);
                },
                error: function(e) {
                   alert(e);
                }
            });

            
            that.set("hasMeterData", true);
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