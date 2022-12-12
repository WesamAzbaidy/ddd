sap.ui.define([
	"sap/ui/base/ManagedObject"
], function(
	ManagedObject
) {
	"use strict";

	return ManagedObject.extend("Jepco.ISU.DM.smartmeter.utils.formatter", {
        removeMatnr: function(oMatnr){
            return "123";
         // return oMatnr.substring(0, 18);
        }
	});
});