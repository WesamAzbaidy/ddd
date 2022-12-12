sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/m/MessageBox","sap/m/Dialog","sap/m/Button","sap/m/ButtonType"],function(e,t,a,o,r,s){"use strict";var n="";var i=localStorage.getItem("user");return e.extend("Jepco.ISU.DM.smartmeter.controller.MoreInfo",{onInit:function(){var e=sap.ui.core.UIComponent.getRouterFor(this);e.getRoute("MoreInfo").attachMatched(this._onRouteMatched,this)},_onRouteMatched:function(e){let t=this;var a=this.getView().getModel("MoreInfoData");console.log("MoreInfoData ",a.oData);n=a.oData;n.deviceCategory=n.deviceCategory.replace(/^0+/,"");var o={custTab:[n]};var r=t.getView().byId("generalInformation");var a=new sap.ui.model.json.JSONModel;a.setData(o);r.setModel(a);var r=t.getView().byId("oldMeter");var a=new sap.ui.model.json.JSONModel;a.setData(o);r.setModel(a);var r=t.getView().byId("newMeter");var a=new sap.ui.model.json.JSONModel;a.setData(o);r.setModel(a);if(n.status=="Approve"){t.getView().byId("btnIdReplacment").setEnabled(false);t.getView().byId("btnIdDelete").setEnabled(false);t.getView().byId("btnIdNotReplacment").setEnabled(false);t.getView().byId("btnIdEditRead").setEnabled(false)}else{t.getView().byId("btnIdReplacment").setEnabled(true);t.getView().byId("btnIdDelete").setEnabled(true);t.getView().byId("btnIdNotReplacment").setEnabled(true);t.getView().byId("btnIdEditRead").setEnabled(true)}},onReplacmentDelete:function(){let e=this;jQuery.sap.require("sap.m.MessageBox");sap.m.MessageBox.error("سيتم الغاء الحركة ... هل انت متأكد؟",{icon:sap.m.MessageBox.Icon.ERROR,title:"تحذير",emphasizedAction:sap.m.MessageBox.Action.NO,actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(t){if(t=="YES"){sap.ui.core.BusyIndicator.show();let t={id:n.id,geraet:n.geraet,status:3,updateBy:i};var o={async:true,crossDomain:true,url:"https://portal.jepco.com.jo/MeterReplacmentPortalApisPRD/api/TbMeterReplacment/UpdateStatus",method:"POST",headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-cache","postman-token":"2a0fce10-5ceb-f02e-7769-d150b5d6fbd5"},data:JSON.stringify(t)};sap.ui.core.BusyIndicator.show(0);$.ajax(o).done(function(t,o){console.log(o);if(o=="success"){a.show("تمت عملية الالغاء بنجاح");e._onRouteMatched();sap.ui.core.BusyIndicator.hide()}sap.ui.core.BusyIndicator.hide()})}}.bind(this)})},onReplacment:function(e){let t=this;let o;let r=n;console.log("Selected row Object onReplacment: ",n);let s={geraet:n.geraet,status:2,updateBy:i};console.log(JSON.stringify(s));var d={async:true,crossDomain:true,url:"https://portal.jepco.com.jo/MeterReplacmentPortalApisPRD/api/TbMeterReplacment/UpdateStatus",method:"POST",headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-cache","postman-token":"2a0fce10-5ceb-f02e-7769-d150b5d6fbd5"},data:JSON.stringify(s)};var l="http://85.159.218.156:8000/sap/opu/odata/sap/ZMETERREADING_SRV_01/MeterServicesSet('"+n.geraet+"')";var c=new Date;var p=c.getHours().toString().padStart(2,"0")+c.getMinutes().toString().padStart(2,"0")+c.getSeconds().toString().padStart(2,"0");var u=r.createdDate.replaceAll("-","")+"-"+p;o={Geraet:r.geraet?r.geraet:"",CustomeName:r.customeName?r.customeName:"",Vrefer:r.vrefer?r.vrefer:"",Anlage:r.anlage?r.anlage:"",Ttypbez:r.ttypbez?r.ttypbez:"",LmeterNo:r.lmeterNo?r.lmeterNo:"",LmrDateFormat:r.lmrDateFormat?r.lmrDateFormat:"",LimpMeterRead:r.limpMeterRead?JSON.stringify(r.limpMeterRead):"",LexpMeterRead:r.lexpMeterRead?JSON.stringify(r.lexpMeterRead):"",Lequnr:r.lequnr?r.lequnr:"",TarifDesc:r.tarifDesc?r.tarifDesc:"",RimpMeterRead:r.rimpMeterRead?JSON.stringify(r.rimpMeterRead):"",RexpMeterRead:r.rexpMeterRead?JSON.stringify(r.rexpMeterRead):"",RmeterNo:r.rmeterNo?r.rmeterNo:"",Contract:r.contract?r.contract:"",Tariftyp:r.tariftyp?r.tariftyp:"",DeviceCategory:r.deviceCategory?r.deviceCategory:"",OimpMeterRead:r.oimpMeterRead?JSON.stringify(r.oimpMeterRead):"",OexpMeterRead:r.oexpMeterRead?JSON.stringify(r.oexpMeterRead):"",Latitude:r.latitude?r.latitude:"",Longitude:r.longitude?r.longitude:"",ImpimageOm:r.impimageOm?r.impimageOm:"",ExpimageOm:r.expimageOm?r.expimageOm:"",ImpimageNm:r.impimageNm?r.impimageNm:"",ExpimageNm:r.expimageNm?r.expimageNm:"",Ui5User:r.ui5User?r.ui5User:"",DuplicateAddr:r.duplicateAddr?r.duplicateAddr:u,MeterCats:r.meterCats?r.meterCats:"",Mru:r.mru?r.mru:"",MruAssignDt:r.mruAssignDt?r.mruAssignDt.replace(/(\d{4})(\d{2})(\d{2})/g,"$1-$2-$3"):"",NewMeterNote:r.newMeterNote?r.newMeterNote:"",OldMeterNote:r.oldMeterNote?r.oldMeterNote:"",Phaz:r.phaz?r.phaz:""};console.log("sap body",JSON.stringify(o));sap.ui.core.BusyIndicator.show(0);console.log("replaceData",o);var m=s.updateBy;o.CustomeName=m;o.RimpMeterRead=o.RimpMeterRead.replace(/\D/g,"");o.OexpMeterRead=o.OexpMeterRead.replace(/\D/g,"");o.OimpMeterRead=o.OimpMeterRead.replace(/\D/g,"");o.RexpMeterRead=o.RexpMeterRead.replace(/\D/g,"");$.ajax({type:"POST",url:"https://portal.jepco.com.jo/JepcoSAPProxyPRD/SapProxy/InsertMeterServicesSet",dataType:"json",contentType:"application/json",data:JSON.stringify(o),success:function(e,o,r){console.log("response",r);console.log("status",o);console.log("data",e);if(o=="200"||o=="201"){a.show("تمت عملية التبديل بنجاح");$.ajax(d).done(function(e,t){console.log(t)});sap.ui.core.BusyIndicator.hide();t.getView().byId("btnIdReplacment").setEnabled(false);t.getView().byId("btnIdDelete").setEnabled(false);t.getView().byId("btnIdNotReplacment").setEnabled(false);t.getView().byId("btnIdEditRead").setEnabled(false)}sap.ui.core.BusyIndicator.hide()},error:function(e){if(e.status=="200"||e.status=="201"||e.responseText=="Data inserted Successfully"){a.show("تمت عملية التبديل بنجاح");$.ajax(d).done(function(e,t){console.log(t)});sap.ui.core.BusyIndicator.hide();t.getView().byId("btnIdReplacment").setEnabled(false);t.getView().byId("btnIdDelete").setEnabled(false);t.getView().byId("btnIdNotReplacment").setEnabled(false);t.getView().byId("btnIdEditRead").setEnabled(false)}else{sap.ui.core.BusyIndicator.hide();console.log("error",e);var o=e.responseJSON.errors.error.innererror.errordetails[0].message;a.error(o)}}})},onNotReplacment:function(e){let t=this;console.log("Selected row Object onNotReplacment: ",n);let o={geraet:n.geraet,status:4,updateBy:i};console.log(JSON.stringify(o));var r={async:true,crossDomain:true,url:"https://portal.jepco.com.jo/MeterReplacmentPortalApisPRD/api/TbMeterReplacment/UpdateStatus",method:"POST",headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-cache","postman-token":"2a0fce10-5ceb-f02e-7769-d150b5d6fbd5"},data:JSON.stringify(o)};sap.ui.core.BusyIndicator.show(0);$.ajax(r).done(function(e,o){console.log(o);if(o=="success"){a.show("تمت عملية الرفض بنجاح");t._onRouteMatched();sap.ui.core.BusyIndicator.hide()}sap.ui.core.BusyIndicator.hide()})},onEditRead:function(){let e=this;console.log(n);let t=e.getView().byId("oimpMeterRead").getValue();let o=e.getView().byId("oexpMeterRead").getValue();let r=e.getView().byId("rimpMeterRead").getValue();let s=e.getView().byId("rexpMeterRead").getValue();console.log(t);console.log(o);console.log(r);console.log(s);let d={geraet:n.geraet,updateBy:i};let l=false;if(n.oimpMeterRead!=t){d.oimpMeterRead=t;n.OimpMeterRead=t;console.log(n.OimpMeterRead);l=true}if(n.oexpMeterRead!=o){d.oexpMeterRead=o;n.OexpMeterRead=o;console.log(n.OexpMeterRead);l=true}if(n.rimpMeterRead!=r){d.rimpMeterRead=r;n.rimpMeterRead=r;console.log(n.rimpMeterRead);l=true}if(n.rexpMeterRead!=s){d.rexpMeterRead=s;n.rexpMeterRead=s;console.log(n.rexpMeterRead);l=true}console.log(d);if(l){var c={async:true,crossDomain:true,url:"https://portal.jepco.com.jo/MeterReplacmentPortalApisPRD/api/TbMeterReplacment/UpdateReadings",method:"POST",headers:{"content-type":"application/json","cache-control":"no-cache"},processData:false,data:JSON.stringify(d)};$.ajax(c).done(function(t,o){console.log(t);console.log(o);var r={custTab:[t]};var s=e.getView().byId("generalInformation");var n=new sap.ui.model.json.JSONModel;n.setData(r);s.setModel(n);var s=e.getView().byId("oldMeter");var n=new sap.ui.model.json.JSONModel;n.setData(r);s.setModel(n);var s=e.getView().byId("newMeter");var n=new sap.ui.model.json.JSONModel;n.setData(r);s.setModel(n);a.show("تمت تعديل القراءات بنجاح")});this.getView().byId("oimpMeterRead").setValue("");this.getView().byId("oexpMeterRead").setValue("");this.getView().byId("rimpMeterRead").setValue("");this.getView().byId("rexpMeterRead").setValue("")}},onPrevious:function(){var e=sap.ui.core.UIComponent.getRouterFor(this);e.navTo("Main")},onEnterItems:function(e){console.log(e.getSource().mProperties.src);var t=e.getSource().mProperties.src;var a=new sap.m.HBox({alignItems:"Center",wrap:"Wrap",justifyContent:"Start",items:[new sap.m.Image({src:t,alt:"test image",mode:"Image",height:"500px",width:"600px"})]});this.oDefaultDialog=new o({title:"الصورة",content:[new sap.ui.layout.form.SimpleForm({editable:false,layout:"ResponsiveGridLayout",content:[a]})],endButton:new r({text:"Close",press:function(){this.oDefaultDialog.close();this.oDefaultDialog.destroyContent()}.bind(this)})});this.getView().addDependent(this.oDefaultDialog);this.oDefaultDialog.open()}})});