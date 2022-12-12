sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/ui/export/Spreadsheet","sap/ui/export/library","sap/m/MessageBox"],function(e,t,r,a,l){"use strict";var o=a.EdmType;return e.extend("Jepco.ISU.DM.smartmeter.controller.RepReport",{onReplaceExcelRepBTNPress:function(){var e=this.getView().byId("idRepDateFm").getDateValue().getFullYear();var t=this.getView().byId("idRepDateFm").getDateValue().getMonth()+1;t=t.toString().length<2?"0"+t.toString():t.toString();var a=this.getView().byId("idRepDateFm").getDateValue().getDate();a=a.toString().length<2?"0"+a.toString():a.toString();var o=[e,t,a].join("");e=this.getView().byId("idRepDateTo").getDateValue().getFullYear();t=this.getView().byId("idRepDateTo").getDateValue().getMonth()+1;t=t.toString().length<2?"0"+t.toString():t.toString();a=this.getView().byId("idRepDateTo").getDateValue().getDate();a=a.toString().length<2?"0"+a.toString():a.toString();var p=[e,t,a].join("");var s=this.getView().byId("idRepBuildUser").getValue();var i=o.replace(/[-]/g,"");var n=p.replace(/[-]/g,"");if(s==""){s="ALL"}var g="P";var c=g+i+n+s;var d=this;$.ajax({type:"POST",url:"https://portal.jepco.com.jo/JepcoSAPProxyPRD/SapProxy/GetDuplicates",dataType:"json",contentType:"application/json",data:JSON.stringify({strMeterNumber:c}),success:function(e,t,a){console.log(e);for(let t=0;t<e.d.results.length;t++){e.d.results[t].geraet=e.d.results[t].geraet.replace(/^0+/,"");e.d.results[t].oexpMeterRead=e.d.results[t].oexpMeterRead.replace(/^0+/,"");e.d.results[t].oimpMeterRead=e.d.results[t].oimpMeterRead.replace(/^0+/,"");e.d.results[t].rexpMeterRead=e.d.results[t].rexpMeterRead.replace(/^0+/,"");e.d.results[t].rimpMeterRead=e.d.results[t].rimpMeterRead.replace(/^0+/,"")}var l=new sap.ui.model.json.JSONModel;var o=e;l.setData(o);s=l.getProperty("/d/results");console.log(l);var p,s,i,n;p=d.createColumnConfig();console.log(p);i={workbook:{columns:p},dataSource:s};n=new r(i);n.build().then(function(){MessageToast.show("Spreadsheet export has finished")}).finally(n.destroy)},error:function(e){console.log(e);l.error(e.responseJSON.errors.error.message.value)}})},createColumnConfig:function(){var e=[{label:"المستخدم",property:"ui5User",type:o.String,scale:0},{label:"رقم الملف",property:"vrefer",type:o.String,scale:0},{label:"رقم العقد",property:"contract",type:o.String,scale:0},{label:"رابط البيانات",property:"anlage",type:o.String,scale:0},{label:"اسم المشترك",property:"customeName",type:o.String,scale:0},{label:"نوع الاشتراك",property:"ttypbez",type:o.String,scale:0},{label:"رقم التجهيزات",property:"lequnr",type:o.String,scale:0},{label:"تاريخ التبديل",property:"actdate",type:o.String,scale:0},{label:"وقت التبديل",property:"acttime",type:o.String,scale:0},{label:"رقم العداد القديم",property:"geraet",type:o.String,scale:0},{label:"قراءة الرفع المستوده",property:"oimpMeterRead",type:o.String,scale:0},{label:"قراءة الرفع المصدرة",property:"oexpMeterRead",type:o.String,scale:0},{label:"رقم العداد الجديد",property:"rmeterNo",type:o.String,scale:0},{label:"قراءة التركيب المستوده",property:"rimpMeterRead",type:o.String,scale:0},{label:"قراءة التركيب المصدرة",property:"rexpMeterRead",type:o.String,scale:0}];return e}})});