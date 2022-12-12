sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/ui/export/Spreadsheet","sap/m/MessageBox","sap/ui/core/BusyIndicator","sap/m/MessageToast","sap/ui/export/library"],function(e,t,r,s,l,a,o){"use strict";return e.extend("Jepco.ISU.DM.smartmeter.controller.StandRep",{onMRUMax:function(){let e=this.getView().byId("idmru").getValue();if(e.length>8){let t=e.slice(0,-1);this.getView().byId("idmru").setValue(t);a.show("لقد تجاوزت الحد المسموح بة");return}},onStandRepExcelBTNPress:function(){if(this.getView().byId("idDateFm1").getValue()==""&&this.getView().byId("idDateTo1").getValue()==""&&this.getView().byId("idmru").getValue()==""){s.show("يرجى ادخال الجولة او التاريخ من .... الى");return}var e="00000000";var t="00000000";if(this.getView().byId("idDateFm1").getValue()!=""){var l=this.getView().byId("idDateFm1").getDateValue().getFullYear();var o=this.getView().byId("idDateFm1").getDateValue().getMonth()+1;o=o.toString().length<2?"0"+o.toString():o.toString();var p=this.getView().byId("idDateFm1").getDateValue().getDate();p=p.toString().length<2?"0"+p.toString():p.toString();e=[l,o,p].join("")}if(this.getView().byId("idDateTo1").getValue()!=""){l=this.getView().byId("idDateTo1").getDateValue().getFullYear();o=this.getView().byId("idDateTo1").getDateValue().getMonth()+1;o=o.toString().length<2?"0"+o.toString():o.toString();p=this.getView().byId("idDateTo1").getDateValue().getDate();p=p.toString().length<2?"0"+p.toString():p.toString();t=[l,o,p].join("")}var i=this.getView().byId("idmru").getValue();var d="MRUD";var u=d+"-"+i+"-"+e+"-"+t;var c=this;sap.ui.core.BusyIndicator.show();$.ajax({type:"POST",url:"https://portal.jepco.com.jo/JepcoSAPProxyPRD/SapProxy/GetDuplicates",dataType:"json",contentType:"application/json",data:JSON.stringify({strMeterNumber:u}),success:function(e,t,s){console.log(e);for(let t=0;t<e.d.results.length;t++){e.d.results[t].geraet=e.d.results[t].geraet.replace(/^0+/,"");e.d.results[t].oexpMeterRead=e.d.results[t].oexpMeterRead.replace(/^0+/,"");e.d.results[t].oimpMeterRead=e.d.results[t].oimpMeterRead.replace(/^0+/,"");e.d.results[t].rexpMeterRead=e.d.results[t].rexpMeterRead.replace(/^0+/,"");e.d.results[t].rimpMeterRead=e.d.results[t].rimpMeterRead.replace(/^0+/,"");e.d.results[t].limpMeterRead=e.d.results[t].limpMeterRead.replace(/^0+/,"");e.d.results[t].lexpMeterRead=e.d.results[t].lexpMeterRead.replace(/^0+/,"");if((e.d.results[t].rimpMeterRead==""||e.d.results[t].rimpMeterRead==" ")&&e.d.results[t].approvalUser=="منجز"){e.d.results[t].rimpMeterRead="0"}}for(let t=0;t<e.d.results.length;t++){e.d.results[t].serial=t+1;const r=e.d.results[t].customeName.split("-");e.d.results[t].customerName=r[0];e.d.results[t].buildingId=r[1];e.d.results[t].instStatus=r[2];e.d.results[t].reason=r[3];e.d.results[t].floorNo=r[4];e.d.results[t].apartmentNo=r[5];e.d.results[t].nationalId=r[6];if(e.d.results[t].instStatus=="1"){e.d.results[t].instStatus="لم يتم التبديل"}else if(e.d.results[t].instStatus=="2"){e.d.results[t].instStatus="عبث / تم التبديل"}else if(e.d.results[t].instStatus=="3"){e.d.results[t].instStatus="عبث / لم يتم التبديل"}else if(e.d.results[t].approvalUser=="منجز"){e.d.results[t].instStatus="تم التبديل"}}for(let t=0;t<e.d.results.length;t++){const r=e.d.results[t].duplicateAddr.split("=");e.d.results[t].commId=r[0];e.d.results[t].regionDesc=r[1];e.d.results[t].cityDesc=r[2];e.d.results[t].districtDesc=r[3];e.d.results[t].streetDesc=r[4];e.d.results[t].buildingNo=r[5];e.d.results[t].elecPoleId=r[6];e.d.results[t].commStatus=r[7];e.d.results[t].jepcoBoxStatus=r[8];e.d.results[t].connectMethod=r[9];e.d.results[t].landMark=r[10];if(e.d.results[t].commId.substring(0,1)=="E"){e.d.results[t].commId="0"}if(e.d.results[t].jepcoBoxStatus==1){e.d.results[t].jepcoBoxStatus="بحاجة لتركيب صندوق اتصالات"}if(e.d.results[t].jepcoBoxStatus==2){e.d.results[t].jepcoBoxStatus="داخل وحده القاطع الرئيسي"}if(e.d.results[t].jepcoBoxStatus==3){e.d.results[t].jepcoBoxStatus="تم تركيب الصندوق"}if(e.d.results[t].connectMethod==1){e.d.results[t].connectMethod="كيبل ارضي من العمود"}if(e.d.results[t].connectMethod==2){e.d.results[t].connectMethod="كيبل ارضي خاص"}if(e.d.results[t].connectMethod==3){e.d.results[t].connectMethod="شبكة هوائية من العمود"}if(e.d.results[t].connectMethod==4){e.d.results[t].connectMethod="كيبل محوري من العمود"}}console.log(e);var l=new sap.ui.model.json.JSONModel;var o=e;l.setData(o);i=l.getProperty("/d/results");console.log(l);var p,i,d,u;p=c.createColumnConfig();console.log(p);d={workbook:{columns:p},dataSource:i};u=new r(d);u.build().then(function(){a.show("Spreadsheet export has finished")}).finally(u.destroy);sap.ui.core.BusyIndicator.hide()},error:function(e){console.log(e);s.error(e.responseJSON.errors.error.message.value);sap.ui.core.BusyIndicator.hide()}})},createColumnConfig:function(){var e=[{label:"التسلسل",property:"serial",scale:0},{label:"الحالة",property:"approvalUser",scale:0},{label:"رقم الملف",property:"vrefer",scale:0},{label:"الجولة",property:"mru",scale:0},{label:"نوع العداد",property:"meterCats",scale:0},{label:"التقني",property:"ui5User",scale:0},{label:"العنوان المسجل في الساب",property:"meterItemsQuantity/cups",scale:0},{label:"خط العرض السابق من الساب",property:"meterItemsQuantity/currentTransformers",scale:0},{label:"خط الطول السابق من الساب",property:"meterItemsQuantity/meterPower",scale:0},{label:"اخر قراءة مستجرة على ساب",property:"limpMeterRead",scale:0},{label:"اخر قراءة مصدرة على ساب",property:"lexpMeterRead",scale:0},{label:"رقم العداد القديم",property:"geraet",scale:0},{label:"قراءة الرفع المستجرة",property:"oimpMeterRead",scale:0},{label:"قراءة الرفع المصدرة",property:"oexpMeterRead",scale:0},{label:"رقم العداد الجديد",property:"rmeterNo",scale:0},{label:"قراءة التركيب المستجرة",property:"rimpMeterRead",scale:0},{label:"قراءة التركيب المصدرة",property:"rexpMeterRead",scale:0},{label:"اسم المشترك",property:"meterItemsQuantity/armedCable",scale:0},{label:"رقم الهاتف",property:"meterItemsQuantity/autoBreacker",scale:0},{label:"اسم الشارع و رقم المبنى من التطبيق",property:"meterItemsQuantity/coaxialCable",scale:0},{label:"رقم الموقع ",property:"buildingId",scale:0},{label:"خط العرض من التطبيق",property:"meterItemsQuantity/copperAluminumClips",scale:0},{label:"خط الطول من التطبيق",property:"meterItemsQuantity/copperTieClips",scale:0},{label:"تركيب صندوق الاتصال",property:"jepcoBoxStatus",scale:0},{label:"رقم صندوق الفايبر",property:"commId",scale:0},{label:"تاريخ الاستبدال",property:"actdate",scale:0},{label:"وقت الاستبدال",property:"acttime",scale:0},{label:"تاريخ التعيين للعداد",property:"mruAssignDt",scale:0},{label:"حالة الاستبدال",property:"instStatus",scale:0},{label:"السبب",property:"reason",scale:0},{label:"ملاحظة العداد القديم",property:"oldMeterNote",scale:0},{label:"ملاحظة العداد الجديد",property:"newMeterNote",scale:0},{label:"رقم العقد",property:"contract",scale:0},{label:"رابط البيانات",property:"anlage",scale:0},{label:"نوع الاشتراك",property:"ttypbez",scale:0},{label:"رقم التجهيزات",property:"lequnr",scale:0},{label:"المحافظة",property:"regionDesc",scale:0},{label:"المنطقة",property:"cityDesc",scale:0},{label:"الحي",property:"districtDesc",scale:0},{label:"طريقة التوصيل",property:"connectMethod",scale:0},{label:"رقم العمود",property:"elecPoleId",scale:0},{label:"رقم الشقة",property:"apartmentNo",scale:0},{label:"رقم الطابق",property:"floorNo",scale:0},{label:"الرقم الوطني",property:"nationalId",scale:0},{label:"المالك",property:"customerName",scale:0}];return e}})});