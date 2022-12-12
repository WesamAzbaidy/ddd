sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
], function(
	Controller,MessageBox,BusyIndicator
) {
	"use strict";

	return Controller.extend("Jepco.ISU.DM.smartmeter.controller.RestPass", {
        
		onShowPassword: function(oEvent){
		    var lv_ID =	oEvent.mParameters.id.split("--")[2];
			var passType = this.getView().byId(lv_ID).getType();
			if ( passType === "Password" ){
				this.getView().byId(lv_ID).setType("Text");
				this.getView().byId(lv_ID).setValueHelpIconSrc("sap-icon://hide");
			}else{
				this.getView().byId(lv_ID).setType("Password");
				this.getView().byId(lv_ID).setValueHelpIconSrc("sap-icon://show");	
			}
		},
        OnRestPassPress: function(){
			var idUser = this.getView().byId("idUserInput").getValue();
			if (idUser == '' || idUser == undefined) {
				MessageBox.alert(' يرجى ادخال اسم المستخدم ')
				return
			}
			var idOldPass = this.getView().byId("idOldPass").getValue();
			if (idOldPass == '' || idOldPass == undefined) {
				MessageBox.alert('يرجى ادخال كلمة المرور الحالية')
				return
			}	
			var idNewPass = this.getView().byId("idNewPass").getValue();
			if (idNewPass == '' || idNewPass == undefined) {
				MessageBox.alert('يرجى ادخال كلمة المرور الجديده')
				return
			}		
			var idNewPassCon = this.getView().byId("idNewPassCon").getValue();
			if (idNewPassCon == '' || idNewPassCon == undefined) {
				MessageBox.alert('يرجى ادخال تأكيد كلمة المرور  ')
				return
			}	
			if (idNewPass != idNewPassCon){
				MessageBox.alert('كلمة المرور الجديدة غير متطابقه')
				return
			}			
			var _NewPass = this.getView().byId("idNewPass").getValue();
 
			if( _NewPass.length < "7"  ||
			    _NewPass.replace(/[^a-zA-Z]+/g,"").length < "3" ||
				_NewPass.replace(/[^0-9]/gi, "").length < "3" ||
				_NewPass.match(/[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) == null ||
				_NewPass.match(/[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g).length < "1" ){
					MessageBox.alert('كلمة المرور الجديدة لا توافق الشروط')
					return
				}
				//var payload = "USR" + oUserID + "-" + oPassID;
				idUser    = this.getView().byId("idUserInput").getValue();
				idOldPass = this.getView().byId("idOldPass").getValue();
				idNewPass = this.getView().byId("idNewPass").getValue();
				var payload = "CPASS" + idUser + "-" + idOldPass + "-" + idNewPass;
				BusyIndicator.show();
				 
				let that = this

				//var url = "http://85.159.218.156:8000/sap/opu/odata/sap/ZMETERREADING_SRV_01/MeterServicesSet('" + payload + "')?$format=json";
				$.ajax({
					type: 'POST',
					url: "https://portal.jepco.com.jo/JepcoSAPProxyPRD/SapProxy/GetMeterServicesSet" ,
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify(
						{
							"strMeterNumber"  :   payload
						}),
					success: function (data, status, response) {
						BusyIndicator.hide();
						 
                        MessageBox.success('تم تغير كلمة المرور بنجاج');
						let oRouter = sap.ui.core.UIComponent.getRouterFor(that);
				        oRouter.navTo("Login"); 
						

					},
					error: function (error) {
						BusyIndicator.hide();
						that.successFlag = false;
						if (error.responseJSON) {
							if(error.responseJSON.errors.error.message.value == ''){
								MessageBox.error('خطأ فني، يرجى المحاولة مرة اخرى لاحقا')
							}else{ 
							var responseMsg  = error.responseJSON.errors.error.message.value; 
							    MessageBox.error(responseMsg);
						   }
						} else {
							MessageBox.error('خطأ فني، يرجى المحاولة مرة اخرى لاحقا')
						}
 
					}
				});
 
        },
		onResetBack: function(){
			 var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			 oRouter.navTo("Login"); 
		},
		onUserInput: function(oEvent){
		//var lv_ID =	oEvent.mParameters.id.split("--")[2];
	    var newUserNameCapital = this.getView().byId("idUserInput").getValue();
		newUserNameCapital = newUserNameCapital.toUpperCase();
		this.getView().byId("idUserInput").setValue(newUserNameCapital);
		},
		onLiveChange: function(oEvent){
			var _NewPass = this.getView().byId("idNewPass").getValue();
			
			var _7Char = this.getView().byId("id7Char");  
			var _3Char = this.getView().byId("id3Char");  
			var _3Num  = this.getView().byId("id3Num");  
			var _1Char = this.getView().byId("id1Char");  

			if( _NewPass.length >= "7" ){
				_7Char.addStyleClass("GreenText");
				_7Char.removeStyleClass("RedText");
				this.getView().byId("idNewPass").setValueState("Success");
				
			}else{
				_7Char.addStyleClass("RedText");
				_7Char.removeStyleClass("GreenText");
				this.getView().byId("idNewPass").setValueState("Error");
			}

			if( _NewPass.replace(/[^a-zA-Z]+/g,"").length >= "3" ){	 
				_3Char.addStyleClass("GreenText");
				_3Char.removeStyleClass("RedText");
			}else{
				_3Char.addStyleClass("RedText");
				_3Char.removeStyleClass("GreenText");
			}

			if( _NewPass.replace(/[^0-9]/gi, "").length >= "3" ){
				_3Num.addStyleClass("GreenText");
				_3Num.removeStyleClass("RedText");
			}else{
				_3Num.addStyleClass("RedText");
				_3Num.removeStyleClass("GreenText");
			}

			if ( _NewPass.match(/[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) == null ) {
				_1Char.addStyleClass("RedText");
				_1Char.removeStyleClass("GreenText");
			} else {
					if( _NewPass.match(/[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g).length >= "1" ){
						_1Char.addStyleClass("GreenText");
						_1Char.removeStyleClass("RedText")
					}else{
						_1Char.addStyleClass("RedText");
						_1Char.removeStyleClass("GreenText");
					} 
			}
			
		//	this.getView().byId("idContinue").setText("Continue");
		}
	});
});