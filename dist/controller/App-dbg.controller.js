sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("Jepco.ISU.DM.smartmeter.controller.App", {
            onInit: function () {
                sap.ui.getCore().getConfiguration().setLanguage("ar");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Login"); 
            }
        });
    });
