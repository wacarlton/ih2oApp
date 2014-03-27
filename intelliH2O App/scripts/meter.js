(function (global) {
    var MeterViewModel,
        app = global.app = global.app || {};

    MeterViewModel = kendo.data.ObservableObject.extend({
        hasMeterData: false,
        meterId: "",
        meterData: {id: ''},

        onSubmit: function () {
            var that = this,
                meterId = that.get("meterId").trim();

            if (meterId === "") {
                navigator.notification.alert("Meter Id Required!",
                    function () { }, "Fetching Details failed", 'OK');

                return;
            }
            
            var dataArr = meterData.data()
            $.ajax({
                type: 'GET',
                url: 'http://qa.intellih2o.com/swma/mi/CABAA00000000397',
                dataType: 'jsonp',
                success: function(data) {
                    alert(data);
                },
                error: function(e) {
                   alert(e);
                }
            });

            
            that.set("hasMeterData", true);
        },

        /*onLogout: function () {
            var that = this;

            that.clearForm();
            that.set("isLoggedIn", false);
        },*/

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