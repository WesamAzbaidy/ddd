sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
], function (Controller, MessageBox, BusyIndicator
	) {
	"use strict";

	return Controller.extend("Jepco.ISU.DM.smartmeter.controller.Login", {
		onRememberMe: function(oEvent){ 
			//oEvent.getSource().getChecked();
			   var ui5U = this.getView().byId("idUser").getValue();
			   var ui5p = this.getView().byId("idPass").getValue();
			   document.cookie = "myusername="+ui5U+";path=http://localhost/web6pm/; expires=" + new Date(9999,1,1).toUTCString();
			   document.cookie = "mypassword="+ui5p+";path=http://localhost/web6pm/; expires=" + new Date(9999,1,1).toUTCString();
		   },
    
	 OnRestPassPress: function () {
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("RestPass");
	},
	    onShowPassword: function(){
			var passType = this.getView().byId("idPass").getType();
			if ( passType === "Password" ){
				this.getView().byId("idPass").setType("Text");
				this.getView().byId("idPass").setValueHelpIconSrc("sap-icon://hide");
			}else{
				this.getView().byId("idPass").setType("Password");
				this.getView().byId("idPass").setValueHelpIconSrc("sap-icon://show");	
			}
		}, 
		
		 /** whene login get User app  and save in localStorage*/
		OnLoginPress: function () {
			var oUserID = this.getView().byId("idUser").getValue();
			var oPassID = this.getView().byId("idPass").getValue();

			var crModelData = { oUserName: oUserID };
			var crModel = new sap.ui.model.json.JSONModel();
			crModel.setData({ globalData: crModelData });
			sap.ui.getCore().setModel(crModel);

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//console.log('oRouter', oRouter)
			//oRouter.navTo("Main");
			var payload = oUserID + "-" + oPassID; 
			const engTechUser = [];

 
			let url = "http://85.159.218.156:8000/sap/opu/odata/sap/ZCOMMDTL_SRV/ZENG_USERSet?$filter=startswith(EngTechUser,'" + payload + "')&$format=json"
			$.ajax({
				type: 'POST',
				url: "https://portal.jepco.com.jo/JepcoSAPProxy/SapProxy/GetEng_MeterSet",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify(
					{
						"strEngUserName"  :    payload
					}),
				success: function (data, status, response) {
					console.log('first success')
					//console.log(JSON.stringify(response.responseJSON.d.results))
					if( typeof(response.responseJSON.d) == 'undefined'){
						MessageBox.error('خطأ فني، يرجى المحاولة لاحقا');
					}
					var results = response.responseJSON.d.results;
					for (const key in results) {
						console.log(results[key].engTechUser);
						var lower =results[key].engTechUser.toLowerCase()
						engTechUser.push(lower)
						// engTechUser.push(results[key].EngTechUser)
					}
					console.log("array engTechUser ", engTechUser);
					localStorage.setItem("engTechUser", JSON.stringify(engTechUser));
					localStorage.setItem("user", oUserID);

					// var aItems = [];
					// for(let i = 0; i < engTechUser.length; i++){
					// 	aItems.push({
					// 		firstColumnText: engTechUser[i],
					// 		secondColumnText: engTechUser[i]
					// 	});
					// }
		
					// var oModel = new sap.ui.model.json.JSONModel({items: aItems});
					// that.getView().setModel(oModel, "userModel");
// 					var jsonArg1 = new Object();
// 					var pluginArrayArg = new Array();
// 				for(let i = 0; i < engTechUser.length; i++){	
// 					jsonArg1.ui5User = engTechUser[i];
// 					pluginArrayArg.push(jsonArg1);
// 				}

//  var oModelx = new sap.ui.model.json.JSONModel(pluginArrayArg);
//  that.getView().setModel(oModelx);

// ///////////////////////////////////////////////
// 				// var crModelUser = new sap.ui.model.json.JSONModel();
// 				// crModelUser.setData({ globalUiUserData: pluginArrayArg });
// 				sap.ui.getCore().setModel(oModelx, "listData");
 
		
				 
					 oRouter.navTo("Main");

				},
				error: function (error) {
					console.log(error);
					BusyIndicator.hide()
					if (error.responseJSON) {
						var dataXml = error.responseJSON;
						var responseMsg = error.responseJSON.errors.error.message.value
						// dataXml.error.innererror.errordetails[0].message;
						MessageBox.error(responseMsg);
					} else {
						MessageBox.error('خطأ فني، يرجى المحاولة مرة اخرى لاحقا')
					}
				}
			});


		}


	});
});