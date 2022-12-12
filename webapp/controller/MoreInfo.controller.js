sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/ButtonType"
], function (
	Controller, JSONModel, MessageBox, Dialog, Button, ButtonType
) {
	"use strict";
	var moreData = ""
	var user = localStorage.getItem('user');

	return Controller.extend("Jepco.ISU.DM.smartmeter.controller.MoreInfo", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("MoreInfo").attachMatched(this._onRouteMatched, this);
		},
		/** whene load page  get info Meter and show in table*/

		_onRouteMatched: function (oEvent) {
			let that = this
			var oModel = this.getView().getModel("MoreInfoData");
			console.log("MoreInfoData ", oModel.oData);
			
			moreData = oModel.oData
			moreData.deviceCategory = moreData.deviceCategory.replace(/^0+/, '');
			var data = {
				"custTab": [moreData]
			};
			var oTable = that.getView().byId("generalInformation");
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(data);
			oTable.setModel(oModel);
			var oTable = that.getView().byId("oldMeter");
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(data);
			oTable.setModel(oModel);
			var oTable = that.getView().byId("newMeter");
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(data);
			oTable.setModel(oModel);

			if (moreData.status == "Approve") {
				that.getView().byId("btnIdReplacment").setEnabled(false);
				that.getView().byId("btnIdDelete").setEnabled(false);
				that.getView().byId("btnIdNotReplacment").setEnabled(false);
				that.getView().byId("btnIdEditRead").setEnabled(false);
			} else {

				that.getView().byId("btnIdReplacment").setEnabled(true);
				that.getView().byId("btnIdDelete").setEnabled(true);
				that.getView().byId("btnIdNotReplacment").setEnabled(true);
				that.getView().byId("btnIdEditRead").setEnabled(true);
			}
			
			var chkTabID = this.getView().getModel("chkTabID");
			var schkTabID = chkTabID.getData().idTab;
		 
			if (schkTabID == "otherMeter") {
				this.getView().byId("idFlex1").setVisible(false);
				this.getView().byId("idFlex2").setVisible(false);
			} else{
				this.getView().byId("idFlex1").setVisible(true);
				this.getView().byId("idFlex2").setVisible(true);
			}
		},
		onReplacmentDelete: function() {
			let that = this;
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.error("سيتم الغاء الحركة ... هل انت متأكد؟", {
				icon: sap.m.MessageBox.Icon.ERROR,
				title: "تحذير",
				emphasizedAction: sap.m.MessageBox.Action.NO,
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose: function(oAction) {
					if (oAction == "YES") { 
						sap.ui.core.BusyIndicator.show();
						
						let data = {
							"id": moreData.id,
							"geraet": moreData.geraet,
							"status": 3,
							"updateBy": user
			
						} 
						var settings = {
							"async": true,
							"crossDomain": true,
							"url": "https://portal.jepco.com.jo/MeterReplacmentPortalApis/api/TbMeterReplacment/UpdateStatus",
							"method": "POST",
							"headers": {
								"content-type": "application/json; charset=utf-8",
								"cache-control": "no-cache",
								"postman-token": "2a0fce10-5ceb-f02e-7769-d150b5d6fbd5"
							},
							"data": JSON.stringify(data)
						}
						sap.ui.core.BusyIndicator.show(0);
			
						$.ajax(settings).done(function (response, status) {
							console.log(status);
							if (status == "success") {
								MessageBox.show("تمت عملية الالغاء بنجاح");
								that.getView().byId("btnIdReplacment").setEnabled(false);
								that.getView().byId("btnIdDelete").setEnabled(false);
								that.getView().byId("btnIdNotReplacment").setEnabled(false);
								that.getView().byId("btnIdEditRead").setEnabled(false); 
								sap.ui.core.BusyIndicator.hide();
			
							}
							sap.ui.core.BusyIndicator.hide();
			
						});
					}
				}.bind(this)
			});
		},
		 
		/**Replacment Meter */
		onReplacment: function (oEvent) {
			// var oButton = oEvent.getSource();
			let that = this
			let replaceData
			let test = moreData
			console.log("Selected row Object onReplacment: ", moreData);
			let data = {
				"geraet": moreData.geraet,
				"status": 2,
				"updateBy": user

			}
			console.log(JSON.stringify(data))
			var settings = {
				"async": true,
				"crossDomain": true,
				"url": "https://portal.jepco.com.jo/MeterReplacmentPortalApis/api/TbMeterReplacment/UpdateStatus",
				"method": "POST",
				"headers": {
					"content-type": "application/json; charset=utf-8",
					"cache-control": "no-cache",
					"postman-token": "2a0fce10-5ceb-f02e-7769-d150b5d6fbd5"
				},
				"data": JSON.stringify(data)
			}
			var Url = "http://85.159.218.156:8000/sap/opu/odata/sap/ZMETERREADING_SRV_01/MeterServicesSet('" + moreData.geraet + "')";
			var today = new Date();
			var actTime = today.getHours().toString().padStart(2, "0")  +  today.getMinutes().toString().padStart(2, "0")  + today.getSeconds().toString().padStart(2, "0") ; 
			var actDateTime = test.createdDate.replaceAll("-","") + '-' + actTime;
			if (test.geraet.length < 5 ) {
				while (test.geraet.length < 5)  test.geraet = "0" +  test.geraet;
			}
			replaceData = {
				"Geraet": test.geraet ? test.geraet : '',
				"CustomeName": test.customeName ? test.customeName : '',
				"Vrefer": test.vrefer ? test.vrefer : '',
				"Anlage": test.anlage ? test.anlage : '',
				"Ttypbez": test.ttypbez ? test.ttypbez : '',
				"LmeterNo": test.lmeterNo ? test.lmeterNo : '',
				"LmrDateFormat": test.lmrDateFormat ? test.lmrDateFormat : '',
				"LimpMeterRead": test.limpMeterRead ? JSON.stringify(test.limpMeterRead) : '',
				"LexpMeterRead": test.lexpMeterRead ? JSON.stringify(test.lexpMeterRead) : '',
				"Lequnr": test.lequnr ? test.lequnr : '',
				"TarifDesc": test.tarifDesc ? test.tarifDesc : '',
				"RimpMeterRead": test.rimpMeterRead ? JSON.stringify(test.rimpMeterRead) : '',
				"RexpMeterRead": test.rexpMeterRead ? JSON.stringify(test.rexpMeterRead) : '',
				"RmeterNo": test.rmeterNo ? test.rmeterNo : '',
				"Contract": test.contract ? test.contract : '',
				"Tariftyp": test.tariftyp ? test.tariftyp : '',
				"DeviceCategory": test.deviceCategory ? test.deviceCategory : '',
				"OimpMeterRead": test.oimpMeterRead ? JSON.stringify(test.oimpMeterRead) : '',
				"OexpMeterRead": test.oexpMeterRead ? JSON.stringify(test.oexpMeterRead) : '',
				"Latitude": test.latitude ? test.latitude : '',
				"Longitude": test.longitude ? test.longitude : '',
				"ImpimageOm": test.impimageOm ? test.impimageOm : '',
				"ExpimageOm": test.expimageOm ? test.expimageOm : '',
				"ImpimageNm": test.impimageNm ? test.impimageNm : '',
				"ExpimageNm": test.expimageNm ? test.expimageNm : '',
				"Ui5User": test.ui5User ? test.ui5User : '',
				"DuplicateAddr": test.duplicateAddr ? test.duplicateAddr : actDateTime,
				"MeterCats" : test.meterCats ? test.meterCats : '',
				"Mru" : test.mru ? test.mru : '',
				"MruAssignDt" :  test.mruAssignDt ? test.mruAssignDt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3') : '',
				"NewMeterNote" :  test.newMeterNote ? test.newMeterNote : '',
				"OldMeterNote" : test.oldMeterNote ? test.oldMeterNote : '',
				"Phaz" : test.phaz ? test.phaz : '',
				"Scandt" : test.scandt ?  test.scandt : ''
			}
			 
// 			currentdate = new Date()
// 			atetime =  currentdate.getHours() + ":"   + currentdate.getMinutes() + ":" + currentdate.getSeconds();
			console.log("sap body", JSON.stringify(replaceData))

			sap.ui.core.BusyIndicator.show(0);
			// $.ajax({
			// 	type: "PUT",
			// 	url: "https://proxy.shopyard.live/proxyRePlace.php?url=" + Url,
			// 	headers: {
			// 		// 'Content-Length': strData.length,
			// 		// 'Host': 'proxy.shopyard.live',
			// 		'Content-Type': 'application/json'
			// 	},
			// 	data: JSON.stringify(replaceData)
			console.log("replaceData",replaceData);
			var portalUser = data.updateBy;
			replaceData.CustomeName = portalUser;
			replaceData.RimpMeterRead = replaceData.RimpMeterRead.replace(/\D/g, '');
			replaceData.OexpMeterRead = replaceData.OexpMeterRead.replace(/\D/g, '');
			replaceData.OimpMeterRead = replaceData.OimpMeterRead.replace(/\D/g, '');
			replaceData.RexpMeterRead = replaceData.RexpMeterRead.replace(/\D/g, '');
			console.log(this.getView().byId("idoimpMeterRead").getText())
			console.log(this.getView().byId("idoexpMeterRead").getText())
			console.log(this.getView().byId("idrimpMeterRead").getText())
			console.log(this.getView().byId("idrexpMeterRead").getText())
			$.ajax({
				type: "POST",
				url: "https://portal.jepco.com.jo/JepcoSAPProxy/SapProxy/InsertMeterServicesSet",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify(replaceData)	,
				success: function (data, status, response) {
					console.log('response', response);
					console.log('status', status);
					console.log('data', data);
					if (status == "200" || status == "201") {
						MessageBox.show("تمت عملية التبديل بنجاح");
						$.ajax(settings).done(function (response, status) {
							console.log(status);
							//that._onRouteMatched()
						});
						sap.ui.core.BusyIndicator.hide();
						that.getView().byId("btnIdReplacment").setEnabled(false);
						that.getView().byId("btnIdDelete").setEnabled(false);
						that.getView().byId("btnIdNotReplacment").setEnabled(false);
						that.getView().byId("btnIdEditRead").setEnabled(false);
						// that.onReplacementSearch();
					}
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (error) {
					if (error.status == '200'  || error.status == '201' || error.responseText == "Data inserted Successfully")
					{
						MessageBox.show("تمت عملية التبديل بنجاح");
						$.ajax(settings).done(function (response, status) {
							console.log(status); 
						});
						sap.ui.core.BusyIndicator.hide();
						that.getView().byId("btnIdReplacment").setEnabled(false);
						that.getView().byId("btnIdDelete").setEnabled(false);
						that.getView().byId("btnIdNotReplacment").setEnabled(false);
						that.getView().byId("btnIdEditRead").setEnabled(false); 
					} else { 
					
					sap.ui.core.BusyIndicator.hide();
					console.log('error', error);
					var responseMsg = error.responseJSON.errors.error.innererror.errordetails[0].message;
					// error.responseJSON.errors.error.message.value;
					MessageBox.error(responseMsg);
				}
				}		
		 

			});


			
		},
		/** not Replacment Meter */

		onNotReplacment: function (oEvent) {
			// var oButton = oEvent.getSource();
			let that = this
			// var oBindingContext = oButton.getBindingContext();  // <<<-- If you have model name pass it here as string
			// var moreData = oBindingContext.getObject();   // getPath() method gives path to model row number
			console.log("Selected row Object onNotReplacment: ", moreData);
			let data = {
				"geraet": moreData.geraet,
				"status": 4,
				"updateBy": user

			}
			console.log(JSON.stringify(data))
			var settings = {
				"async": true,
				"crossDomain": true,
				"url": "https://portal.jepco.com.jo/MeterReplacmentPortalApis/api/TbMeterReplacment/UpdateStatus",
				"method": "POST",
				"headers": {
					"content-type": "application/json; charset=utf-8",
					"cache-control": "no-cache",
					"postman-token": "2a0fce10-5ceb-f02e-7769-d150b5d6fbd5"
				},
				"data": JSON.stringify(data)
			}
			sap.ui.core.BusyIndicator.show(0);

			$.ajax(settings).done(function (response, status) {
				console.log(status);
				if (status == "success") {
					MessageBox.show("تمت عملية الرفض بنجاح");
					//that._onRouteMatched()
					sap.ui.core.BusyIndicator.hide();

				}
				sap.ui.core.BusyIndicator.hide();

			});
		},
		/** Edit read for  Meter*/
		onEditRead: function () {
			let that = this
			console.log(moreData)

			let oimpMeterRead = that.getView().byId('oimpMeterRead').getValue()
			let oexpMeterRead = that.getView().byId('oexpMeterRead').getValue()
			let rimpMeterRead = that.getView().byId('rimpMeterRead').getValue()
			let rexpMeterRead = that.getView().byId('rexpMeterRead').getValue()

			console.log(oimpMeterRead)
			console.log(oexpMeterRead)
			console.log(rimpMeterRead)
			console.log(rexpMeterRead)

			let data = {
				"geraet": moreData.geraet,
				"updateBy": user
			};
			//"rmeterNo": moreData.rmeterNo ,
			let flag = false
			if (moreData.oimpMeterRead != oimpMeterRead) {
				data.oimpMeterRead = oimpMeterRead
				moreData.OimpMeterRead = oimpMeterRead
				console.log(moreData.OimpMeterRead)

				flag = true
			}
			if (moreData.oexpMeterRead != oexpMeterRead) {
				data.oexpMeterRead = oexpMeterRead
				moreData.OexpMeterRead = oexpMeterRead
				console.log(moreData.OexpMeterRead)

				flag = true

			}
			if (moreData.rimpMeterRead != rimpMeterRead) {
				data.rimpMeterRead = rimpMeterRead
				moreData.rimpMeterRead = rimpMeterRead
				console.log(moreData.rimpMeterRead)

				flag = true

			}
			if (moreData.rexpMeterRead != rexpMeterRead) {
				data.rexpMeterRead = rexpMeterRead
				moreData.rexpMeterRead = rexpMeterRead
				console.log(moreData.rexpMeterRead)
				flag = true

			}
			console.log(data)

			if (flag) {
				var settings = {
					"async": true,
					"crossDomain": true,
					"url": "https://portal.jepco.com.jo/MeterReplacmentPortalApis/api/TbMeterReplacment/UpdateReadings",
					"method": "POST",
					"headers": {
						"content-type": "application/json",
						"cache-control": "no-cache",
					},
					"processData": false,
					"data": JSON.stringify(data)
				}
				sap.ui.core.BusyIndicator.show();
				$.ajax(settings).done(function (response, status) {
					console.log(response);
					console.log(status);
					var data = {
						"custTab": [response]
					};
					var oTable = that.getView().byId("generalInformation");
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data);
					oTable.setModel(oModel);
					var oTable = that.getView().byId("oldMeter");
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data);
					oTable.setModel(oModel);
					var oTable = that.getView().byId("newMeter");
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data);
					oTable.setModel(oModel);
					console.log(moreData  );
					MessageBox.show("تم تعديل القراءات بنجاح");
					moreData.oimpMeterRead= data.custTab[0].oimpMeterRead;
					moreData.oexpMeterRead= data.custTab[0].oexpMeterRead;
					moreData.rimpMeterRead= data.custTab[0].rimpMeterRead;
					moreData.rexpMeterRead= data.custTab[0].rexpMeterRead; 
					sap.ui.core.BusyIndicator.hide();
					var oDataEdit = data
				});
				this.getView().byId('oimpMeterRead').setValue("");
				this.getView().byId('oexpMeterRead').setValue("");
				this.getView().byId('rimpMeterRead').setValue("");
				this.getView().byId('rexpMeterRead').setValue("");
			}
		},
		/** go to  Previous page*/
		onPrevious: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Main");
		},
		/** zoom image */
		onEnterItems: function (oEvent) {
			console.log(oEvent.getSource().mProperties.src)
			var src = oEvent.getSource().mProperties.src
			var flexbox = new sap.m.HBox({
				alignItems: "Center", wrap: "Wrap", justifyContent: "Start",
				items: [
					new sap.m.Image({

						src: src,
						alt: "test image",
						mode : "Image",
						height : "500px", 
						width : "600px"  


					})

				]
			});
			this.oDefaultDialog = new Dialog({
				title: "الصورة",
				content: [new sap.ui.layout.form.SimpleForm({
					editable: false, layout: "ResponsiveGridLayout",
					content: [flexbox]
				})],
				endButton: new Button({
					text: "Close",
					press: function () {
						this.oDefaultDialog.close();
						this.oDefaultDialog.destroyContent();
					}.bind(this)
				})
			});
			this.getView().addDependent(this.oDefaultDialog);
			this.oDefaultDialog.open();
		},

	});
});