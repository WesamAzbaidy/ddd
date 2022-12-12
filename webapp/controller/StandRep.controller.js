sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/ui/export/Spreadsheet',
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageToast",
	'sap/ui/export/library', 
], function(
	Controller,JSONModel,Spreadsheet,MessageBox,BusyIndicator,MessageToast,exportLibrary
) {
	"use strict";

	return Controller.extend("Jepco.ISU.DM.smartmeter.controller.StandRep", {

		onMRUMax: function(){
			let lv_idmru    = this.getView().byId('idmru').getValue()
			if (lv_idmru.length > 8 ) {
				let new_idmruVal = lv_idmru.slice(0, -1);
				this.getView().byId('idmru').setValue(new_idmruVal) 
				MessageToast.show("لقد تجاوزت الحد المسموح بة");
			 	return;
			}
		},
        
		onStandRepExcelBTNPress: function(){
			if ( (this.getView().byId("idDateFm1").getValue() == '' && 
				  this.getView().byId("idDateTo1").getValue() == '' ) &&
				this.getView().byId("idmru").getValue() == '') {
					MessageBox.show("يرجى ادخال الجولة او التاريخ من .... الى");
					return;
			}
			var datefm ='00000000';
			var dateto ='00000000';
			if (  this.getView().byId("idDateFm1").getValue() != '') {
				var lv_year = this.getView().byId("idDateFm1").getDateValue().getFullYear();
				var lv_month = this.getView().byId("idDateFm1").getDateValue().getMonth() + 1 ;
				lv_month = lv_month.toString().length < 2 ?  ("0" + lv_month.toString() ) : lv_month.toString();
				var lv_day = this.getView().byId("idDateFm1").getDateValue().getDate();
				lv_day = lv_day.toString().length < 2 ?  ("0" + lv_day.toString() ) : lv_day.toString();
				datefm = [lv_year, lv_month, lv_day].join('');		 
			};
			if (this.getView().byId("idDateTo1").getValue() != '') {
			lv_year = this.getView().byId("idDateTo1").getDateValue().getFullYear();
			lv_month = this.getView().byId("idDateTo1").getDateValue().getMonth() + 1 ;
			lv_month = lv_month.toString().length < 2 ?  ("0" + lv_month.toString() ) : lv_month.toString();
			lv_day = this.getView().byId("idDateTo1").getDateValue().getDate();
			lv_day = lv_day.toString().length < 2 ?  ("0" + lv_day.toString() ) : lv_day.toString();
			dateto = [lv_year, lv_month, lv_day].join('');
			};
			
			var vMRU =  this.getView().byId("idmru").getValue();
			var flg = 'MRUD'
			var payload = flg + '-' +  vMRU + '-' + datefm + '-' + dateto; 
			var that = this;
			sap.ui.core.BusyIndicator.show();
			$.ajax({
				type: 'POST',
				url: "https://portal.jepco.com.jo/JepcoSAPProxy/SapProxy/GetDuplicates" ,
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify(
					{
						"strMeterNumber"  :   payload
					}),
				success: function (data, status, response) {
					console.log(data);
					for(let i=0;i<data.d.results.length;i++){
						data.d.results[i].geraet = data.d.results[i].geraet.replace(/^0+/, '')
						data.d.results[i].oexpMeterRead = data.d.results[i].oexpMeterRead.replace(/^0+/, '')
						data.d.results[i].oimpMeterRead = data.d.results[i].oimpMeterRead.replace(/^0+/, '')
						data.d.results[i].rexpMeterRead = data.d.results[i].rexpMeterRead.replace(/^0+/, '')
						data.d.results[i].rimpMeterRead = data.d.results[i].rimpMeterRead.replace(/^0+/, '')
						data.d.results[i].limpMeterRead = data.d.results[i].limpMeterRead.replace(/^0+/, '')
						data.d.results[i].lexpMeterRead = data.d.results[i].lexpMeterRead.replace(/^0+/, '')
						
						if (data.d.results[i].deviceCategory == '000000000027800001' || 
						    data.d.results[i].deviceCategory == '000000000027600001' || 
						    data.d.results[i].deviceCategory == '000000000027401101') {
								data.d.results[i].techCategory = 'GPRS 3 phase'
						} else if (data.d.results[i].deviceCategory == '000000000027401104') {
							    data.d.results[i].techCategory = 'Ethernet 3 phase'
						} else if (data.d.results[i].deviceCategory == '000000000027401102') {
							    data.d.results[i].techCategory = 'PLC 3 phase'
					    }else if (data.d.results[i].deviceCategory == '000000000027201101') {
							    data.d.results[i].techCategory = 'GPRS 1 phase'
					    }else if (data.d.results[i].deviceCategory == '000000000027201104') {
							    data.d.results[i].techCategory = 'Ethernet 1 phase'
					    }else if (data.d.results[i].deviceCategory == '000000000027201102') {
							    data.d.results[i].techCategory = 'PLC 1 phase'
						} else {
							data.d.results[i].techCategory = ''
						}
						
						if((data.d.results[i].rimpMeterRead =='' || data.d.results[i].rimpMeterRead == ' ') && data.d.results[i].approvalUser == "منجز") 
						   {data.d.results[i].rimpMeterRead='0'}
					}
					 
					for (let key = 0; key < data.d.results.length; key++){
						data.d.results[key].serial = key+1;
					const myArray = data.d.results[key].customeName.split('-')
						data.d.results[key].customerName  = myArray[0];
						data.d.results[key].buildingId    = myArray[1];
						data.d.results[key].instStatus    = myArray[2];
						data.d.results[key].reason        = myArray[3];
						data.d.results[key].floorNo       = myArray[4];
						data.d.results[key].apartmentNo   = myArray[5];
						data.d.results[key].nationalId    = myArray[6];
						if(data.d.results[key].instStatus == '1'){data.d.results[key].instStatus = 'لم يتم التبديل'}
						else if(data.d.results[key].instStatus == '2'){data.d.results[key].instStatus = 'عبث / تم التبديل'}
						else if(data.d.results[key].instStatus == '3'){data.d.results[key].instStatus = 'عبث / لم يتم التبديل'}
						else if (data.d.results[key].approvalUser == "منجز"){data.d.results[key].instStatus = 'تم التبديل'};
					 }

					 for (let key = 0; key < data.d.results.length; key++){
						const myArrayDup = data.d.results[key].duplicateAddr.split('=')
						data.d.results[key].commId         = myArrayDup[0];
						data.d.results[key].regionDesc     = myArrayDup[1];
						data.d.results[key].cityDesc       = myArrayDup[2];
						data.d.results[key].districtDesc   = myArrayDup[3];
						data.d.results[key].streetDesc     = myArrayDup[4];
						data.d.results[key].buildingNo     = myArrayDup[5];
						data.d.results[key].elecPoleId     = myArrayDup[6];
						data.d.results[key].commStatus     = myArrayDup[7];
						data.d.results[key].jepcoBoxStatus = myArrayDup[8];
						data.d.results[key].connectMethod  = myArrayDup[9];
						data.d.results[key].landMark       = myArrayDup[10];
						if(data.d.results[key].commId.substring(0,1)  == 'E'){
							data.d.results[key].commId = '0'
						}
						// if (data.d.results[key].jepcoBoxStatus == 1) {
						// 	data.d.results[key].jepcoBoxStatus = 'بحاجة لتركيب صندوق اتصالات';
						// };
						// if (data.d.results[key].jepcoBoxStatus == 2) {
						// 	data.d.results[key].jepcoBoxStatus = 'داخل وحده القاطع الرئيسي';
						// };
						// if (data.d.results[key].jepcoBoxStatus == 3) {
						// 	data.d.results[key].jepcoBoxStatus = 'تم تركيب الصندوق';
						// };	
						if (data.d.results[key].commStatus == 1) {
							data.d.results[key].commStatus =  'يوجد صندوق الياف ضوئية ورقم';
						};
						if (data.d.results[key].commStatus == 2) {
							data.d.results[key].commStatus = 'يوجد صندوق الياف ضوئية بدون رقم';
						};	
						if (data.d.results[key].commStatus == 3) {
							data.d.results[key].commStatus = 'لا يوجد صندوق الياف ضوئية';
						};						 
						if (data.d.results[key].connectMethod == 1) {
							data.d.results[key].connectMethod =  'كيبل ارضي من العمود';
						};
						if (data.d.results[key].connectMethod == 2) {
						data.d.results[key].connectMethod = 'كيبل ارضي خاص';
						};
						if (data.d.results[key].connectMethod == 3) {
							data.d.results[key].connectMethod = 'شبكة هوائية من العمود';
						};
						if (data.d.results[key].connectMethod == 4) {
							data.d.results[key].connectMethod = 'كيبل محوري من العمود';
						};	
					 } 
 
					console.log(data);			
                    var oModel = new sap.ui.model.json.JSONModel();
					var oData = data ;
					oModel.setData(oData);
					aProducts = oModel.getProperty('/d/results');
					console.log(oModel);

					var aCols, aProducts, oSettings, oSheet;
					aCols = that.createColumnConfig();
					console.log(aCols); 
		
				  oSettings = {
					  workbook: { columns: aCols },
					  dataSource: aProducts
				  };
		
				  oSheet = new Spreadsheet(oSettings);
				  oSheet.build()
					  .then( function() {
						  MessageToast.show('Spreadsheet export has finished');
					  })
					  .finally(oSheet.destroy);
					  sap.ui.core.BusyIndicator.hide();

				},
				error: function (error) {
					 console.log(error);
					 MessageBox.error(error.responseJSON.errors.error.message.value);
					 sap.ui.core.BusyIndicator.hide();
				}

			});
		},
		createColumnConfig: function() {
			var lf_excel = [  
				{
					label: 'التسلسل',
					property: 'serial', 
					scale: 0
				},
				{
					label: 'الحالة',
					property: 'approvalUser', 
					scale: 0
				},
				{
					label: 'رقم الملف',
					property: 'vrefer', 
					scale: 0
				}, 
				{
					label: 'الجولة',
					property: 'mru', 
					scale: 0
				},
				{
					label: 'نوع العداد',
					property: 'meterCats', 
					scale: 0
				},
				{
					label: 'التقني',
					property: 'ui5User', 
					scale: 0
				},
				{
					label: 'العنوان المسجل في الساب',
					property: 'meterItemsQuantity/cups', 
					scale: 0
				} ,
				{
					label: 'خط العرض السابق من الساب',
					property: 'meterItemsQuantity/currentTransformers', 
					scale: 0
				} ,
				{
					label: 'خط الطول السابق من الساب',
					property: 'meterItemsQuantity/meterPower', 
					scale: 0
				} ,
				{
					label: 'اخر قراءة مستجرة على ساب',
					property: 'limpMeterRead', 
					scale: 0
				} ,
				{
					label: 'اخر قراءة مصدرة على ساب',
					property: 'lexpMeterRead', 
					scale: 0
				},
				{
					label: 'رقم العداد القديم',
					property: 'geraet', 
					scale: 0
				},
				{
					label: 'قراءة الرفع المستجرة',
					property: 'oimpMeterRead', 
					scale: 0
				},
				{
					label: 'قراءة الرفع المصدرة',
					property: 'oexpMeterRead', 
					scale: 0
				},
				{
					label: 'رقم العداد الجديد',
					property: 'rmeterNo', 
					scale: 0
				},
				{
					label: 'تكنولوجيا الاتصال',
					property: 'techCategory', 
					scale: 0
				},
				{
					label: 'قراءة التركيب المستجرة',
					property: 'rimpMeterRead', 
					scale: 0
				},
				{
					label: 'قراءة التركيب المصدرة',
					property: 'rexpMeterRead', 
					scale: 0
				},
				{
					label: 'اسم المشترك',
					property: 'meterItemsQuantity/armedCable', 
					scale: 0
				}, 
				{
					label: 'رقم الهاتف',
					property: 'meterItemsQuantity/autoBreacker', 
					scale: 0
				},
				{
					label: 'اسم الشارع و رقم المبنى من التطبيق',
					property: 'meterItemsQuantity/coaxialCable', 
					scale: 0
				},
				{
					label: 'رقم الموقع ',
					property: 'buildingId', 
					scale: 0
				},
				{
					label: 'خط العرض من التطبيق',
					property: 'meterItemsQuantity/copperAluminumClips', 
					scale: 0
				},
				{
					label: 'خط الطول من التطبيق',
					property: 'meterItemsQuantity/copperTieClips', 
					scale: 0
				},
				// {
				// 	label: 'تركيب صندوق الاتصال',
				// 	property: 'jepcoBoxStatus', 
				// 	scale: 0
				// },  
				{
					label: 'حالة صندوق الفايبر',
					property: 'commStatus', 
					scale: 0
				},
				{
					label: 'رقم صندوق الفايبر',
					property: 'commId', 
					scale: 0
				},
				{
					label: 'وقت القراءة',
					property: 'scandt', 
					scale: 0
				},
				{
					label: 'تاريخ الاستبدال',
					property: 'actdate', 
					scale: 0
				},
				{
					label: 'وقت الاستبدال',
					property: 'acttime', 
					scale: 0
				},
				{
					label: 'تاريخ التعيين للعداد',
					property: 'mruAssignDt', 
					scale: 0
				},
				{
					label: 'حالة الاستبدال',
					property: 'instStatus', 
					scale: 0
				},
				{
					label: 'السبب',
					property: 'reason', 
					scale: 0
				},
				{
					label: 'ملاحظة العداد القديم',
					property: 'oldMeterNote', 
					scale: 0
				},
				{
					label: 'ملاحظة العداد الجديد',
					property: 'newMeterNote', 
					scale: 0
				},
				{
					label: 'رقم العقد',
					property: 'contract', 
					scale: 0
				},
				{
					label: 'رابط البيانات',
					property: 'anlage', 
					scale: 0
				},
				{
					label: 'نوع الاشتراك',
					property: 'ttypbez', 
					scale: 0
				},
				{
					label: 'رقم التجهيزات',
					property: 'lequnr', 
					scale: 0
				},
				{
					label: 'المحافظة',
					property: 'regionDesc', 
					scale: 0
				},
				{
					label: 'المنطقة',
					property: 'cityDesc', 
					scale: 0
				},
				{
					label: 'الحي',
					property: 'districtDesc', 
					scale: 0
				},
				// {
				// 	label: 'اسم الشارع',
				// 	property: 'streetDesc', 
				// 	scale: 0
				// },
				// {
				// 	label: 'رقم البناية',
				// 	property: 'buildingNo', 
				// 	scale: 0
				// },
				{
					label: 'طريقة التوصيل',
					property: 'connectMethod' ,
					scale: 0
				},
				{
					label: 'رقم العمود',
					property: 'elecPoleId' ,
					scale: 0
				},
				{
					label: 'رقم الشقة',
					property: 'apartmentNo' ,
					scale: 0
				}, 
				{
					label: 'رقم الطابق',
					property: 'floorNo', 
					scale: 0
				}, 
				{
					label: 'الرقم الوطني',
					property: 'nationalId', 
					scale: 0
				},	
				{
					label: 'المالك',
					property: 'customerName', 
					scale: 0
				} 		 



				// {
				// 	label: 'اقرب معلم',
				// 	property: 'landMark', 
				// 	scale: 0
				// },
			
			
				// {
				// 	label: 'رمز المبني',
				// 	property: 'buildingId' ,
				// 	scale: 0
				// },	
			
				
				
			]    
			return lf_excel;
		}
	});
});