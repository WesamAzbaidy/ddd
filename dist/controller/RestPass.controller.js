sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageBox","sap/ui/core/BusyIndicator"],function(e,t,s){"use strict";return e.extend("Jepco.ISU.DM.smartmeter.controller.RestPass",{onShowPassword:function(e){var t=e.mParameters.id.split("--")[2];var s=this.getView().byId(t).getType();if(s==="Password"){this.getView().byId(t).setType("Text");this.getView().byId(t).setValueHelpIconSrc("sap-icon://hide")}else{this.getView().byId(t).setType("Password");this.getView().byId(t).setValueHelpIconSrc("sap-icon://show")}},OnRestPassPress:function(){var e=this.getView().byId("idUserInput").getValue();if(e==""||e==undefined){t.alert(" يرجى ادخال اسم المستخدم ");return}var r=this.getView().byId("idOldPass").getValue();if(r==""||r==undefined){t.alert("يرجى ادخال كلمة المرور الحالية");return}var a=this.getView().byId("idNewPass").getValue();if(a==""||a==undefined){t.alert("يرجى ادخال كلمة المرور الجديده");return}var i=this.getView().byId("idNewPassCon").getValue();if(i==""||i==undefined){t.alert("يرجى ادخال تأكيد كلمة المرور  ");return}if(a!=i){t.alert("كلمة المرور الجديدة غير متطابقه");return}var l=this.getView().byId("idNewPass").getValue();if(l.length<"7"||l.replace(/[^a-zA-Z]+/g,"").length<"3"||l.replace(/[^0-9]/gi,"").length<"3"||l.match(/[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g)==null||l.match(/[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g).length<"1"){t.alert("كلمة المرور الجديدة لا توافق الشروط");return}e=this.getView().byId("idUserInput").getValue();r=this.getView().byId("idOldPass").getValue();a=this.getView().byId("idNewPass").getValue();var d="CPASS"+e+"-"+r+"-"+a;s.show();let n=this;$.ajax({type:"POST",url:"https://portal.jepco.com.jo/JepcoSAPProxyPRD/SapProxy/GetMeterServicesSet",dataType:"json",contentType:"application/json",data:JSON.stringify({strMeterNumber:d}),success:function(e,r,a){s.hide();t.success("تم تغير كلمة المرور بنجاج");let i=sap.ui.core.UIComponent.getRouterFor(n);i.navTo("Login")},error:function(e){s.hide();n.successFlag=false;if(e.responseJSON){if(e.responseJSON.errors.error.message.value==""){t.error("خطأ فني، يرجى المحاولة مرة اخرى لاحقا")}else{var r=e.responseJSON.errors.error.message.value;t.error(r)}}else{t.error("خطأ فني، يرجى المحاولة مرة اخرى لاحقا")}}})},onResetBack:function(){var e=sap.ui.core.UIComponent.getRouterFor(this);e.navTo("Login")},onUserInput:function(e){var t=this.getView().byId("idUserInput").getValue();t=t.toUpperCase();this.getView().byId("idUserInput").setValue(t)},onLiveChange:function(e){var t=this.getView().byId("idNewPass").getValue();var s=this.getView().byId("id7Char");var r=this.getView().byId("id3Char");var a=this.getView().byId("id3Num");var i=this.getView().byId("id1Char");if(t.length>="7"){s.addStyleClass("GreenText");s.removeStyleClass("RedText");this.getView().byId("idNewPass").setValueState("Success")}else{s.addStyleClass("RedText");s.removeStyleClass("GreenText");this.getView().byId("idNewPass").setValueState("Error")}if(t.replace(/[^a-zA-Z]+/g,"").length>="3"){r.addStyleClass("GreenText");r.removeStyleClass("RedText")}else{r.addStyleClass("RedText");r.removeStyleClass("GreenText")}if(t.replace(/[^0-9]/gi,"").length>="3"){a.addStyleClass("GreenText");a.removeStyleClass("RedText")}else{a.addStyleClass("RedText");a.removeStyleClass("GreenText")}if(t.match(/[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g)==null){i.addStyleClass("RedText");i.removeStyleClass("GreenText")}else{if(t.match(/[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g).length>="1"){i.addStyleClass("GreenText");i.removeStyleClass("RedText")}else{i.addStyleClass("RedText");i.removeStyleClass("GreenText")}}}})});