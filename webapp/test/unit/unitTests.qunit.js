/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"JepcoISU.DM./smartmeter/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
