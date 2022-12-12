sap.ui.define([
	'sap/ui/core/mvc/Controller', 
	'sap/ui/model/json/JSONModel',
	'sap/ui/export/Spreadsheet',
	'sap/ui/export/library', 
	"sap/m/MessageBox"
], function(
	Controller,
	JSONModel,
	Spreadsheet,
	exportLibrary, 
	MessageBox
) {
	"use strict";
	var EdmType = exportLibrary.EdmType;

	return Controller.extend("Jepco.ISU.DM.smartmeter.controller.Report", {
		onBuildingExcelRepBTNPress: function(){
			//var datefm = this.getView().byId("idDateFm").getValue();
			var lv_year = this.getView().byId("idDateFm").getDateValue().getFullYear();
			var lv_month = this.getView().byId("idDateFm").getDateValue().getMonth() + 1 ;
			lv_month = lv_month.toString().length < 2 ?  ("0" + lv_month.toString() ) : lv_month.toString();
			var lv_day = this.getView().byId("idDateFm").getDateValue().getDate();
			lv_day = lv_day.toString().length < 2 ?  ("0" + lv_day.toString() ) : lv_day.toString();
			var datefm = [lv_year, lv_month, lv_day].join('')			
			//var dateto = this.getView().byId("idDateTo").getValue();
			lv_year = this.getView().byId("idDateTo").getDateValue().getFullYear();
			lv_month = this.getView().byId("idDateTo").getDateValue().getMonth() + 1 ;
			lv_month = lv_month.toString().length < 2 ?  ("0" + lv_month.toString() ) : lv_month.toString();
			lv_day = this.getView().byId("idDateTo").getDateValue().getDate();
			lv_day = lv_day.toString().length < 2 ?  ("0" + lv_day.toString() ) : lv_day.toString();
			var dateto = [lv_year, lv_month, lv_day].join('');
			var builUser = this.getView().byId("idBuildUser").getValue();
			var dateFm = "'" + datefm.replace(/[-]/g, '') ;
			var dateTo = dateto.replace(/[-]/g, '') + "'";
			if(builUser == '') {
				builUser = "'ALL'"
			}
			else{
				builUser = "'" + builUser +  "'";
			};
			
			//"CommId ge '20220101-20220830' or CommId eq 'ALL'" 
			var  payload = 'CommId ge ' + dateFm + '-' + dateTo + ' or CommId eq ' +  builUser  ;
			var that = this;
			$.ajax({
				type: 'POST',
				url: "https://portal.jepco.com.jo/JepcoSAPProxy/SapProxy/GetReport" ,
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify(
					{
						"ReportParm"  :   payload
					}),
				success: function (data, status, response) {
					console.log(data);
					for (let key = 0; key < data.d.results.length; key++){
						//'commstrdtl/results/1/fileNo'
						//'commstrdtl/results/0/tenantName'
						const myArray = data.d.results[key].commstrdtl.results[0].tenantName.split("-");
						var execFields = {'fileNo'       :myArray[1],
						                  'oldMeterNo'   :myArray[2].replace(/^0+/, ''), 
										  'oldMeterRDNGI': myArray[3].replace(/^0+/, ''),
										  'oldMeterRDNGE': myArray[4].replace(/^0+/, ''),
										  'newMeterNO'   :myArray[5].replace(/^0+/, ''), 
										  'newMeterRDNGI': myArray[6].replace(/^0+/, ''),
										  'newMeterRDNGE': myArray[7].replace(/^0+/, ''),
										  'noteType': myArray[8],
										  'noteDesc': myArray[9],
										}
						data.d.results[key].commstrdtl.results.push(execFields);
						data.d.results[key].transDt = data.d.results[key].transDt.split('T')[0];
						data.d.results[key].commstrdtl.results[0].transDt = data.d.results[key].commstrdtl.results[0].transDt.split('T')[0];
						// if (data.d.results[key].jepcoBoxStatus == 1) {
						// 	data.d.results[key].jepcoBoxStatus = 'بحاجة لتركيب صندوق اتصالات';
						// };
						// if (data.d.results[key].jepcoBoxStatus == 2) {
						// 	data.d.results[key].jepcoBoxStatus = 'داخل وحده القاطع الرئيسي';
						// };
						// if (data.d.results[key].jepcoBoxStatus == 3) {
						// 	data.d.results[key].jepcoBoxStatus = 'تم تركيب الصندوق';
						// };	
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
						if (data.d.results[key].commStatus == 1) {
							data.d.results[key].commStatus =  'يوجد صندوق الياف ضوئية ورقم';
						};
						if (data.d.results[key].commStatus == 2) {
							data.d.results[key].commStatus = 'يوجد صندوق الياف ضوئية بدون رقم';
						};	
						if (data.d.results[key].commStatus == 3) {
							data.d.results[key].commStatus = 'لا يوجد صندوق الياف ضوئية';
						};							
						if (data.d.results[key].commId == 0 || data.d.results[key].commId.charAt(0) == 'E')  {
							data.d.results[key].commId = '';
						};		
						if (data.d.results[key].commstrdtl.results[0].commId == 0 || data.d.results[key].commstrdtl.results[0].commId.charAt(0) == 'E')  {
							data.d.results[key].commstrdtl.results[0].commId = '';
						};
						if (data.d.results[key].commstrdtl.results[0].owner == 1 )  {
							data.d.results[key].commstrdtl.results[0].owner = 'مالك';
						};										
						if (data.d.results[key].commstrdtl.results[0].owner == 2 )  {
							data.d.results[key].commstrdtl.results[0].owner = 'مستأجر';
						};	
						if (data.d.results[key].commstrdtl.results[0].owner == 3 )  {
							data.d.results[key].commstrdtl.results[0].owner = 'غير معروف';
						};			
						    //data.d.results[key].commstrdtl.results[0].oldMeterNo =  data.d.results[key].commstrdtl.results[0].oldMeterNo.replace(/^0+/, '');
					 
						var vTime = data.d.results[key].commstrdtl.results[0].tenantName;
						var hour = vTime.toString().length < 2 ?  ("0" + vTime.toString() ) : vTime.toString().substr(0, 2);
						var mint = vTime.toString().length < 2 ?  ("0" + vTime.toString() ) : vTime.toString().substr(2, 2);
						var secd = vTime.toString().length < 2 ?  ("0" + vTime.toString() ) : vTime.toString().substr(4, 2);
						data.d.results[key].commstrdtl.results[0].tenantName = [hour, mint, secd].join(':')
						 
					}
					

//					data.d.results[0].commStatus = data.d.results[0].commStatus == 1 ? 'بحاجة لتركيب صندوق اتصالات' : data.d.results[0].commStatus == 2 ?  'داخل وحده القاطع الرئيسي'  : data.d.results[0].commStatus == 3 ?  'تم تركيب الصندوق'  : data.d.results[0].commStatus
					var oModel = new sap.ui.model.json.JSONModel();
					var oData = data ;
					oModel.setData(oData);
					aProducts = oModel.getProperty('/d/results');
					console.log(oModel);

					var aCols, aProducts, oSettings, oSheet;
					aCols = that.createColumnConfig();
					console.log(aCols);
				//	aProducts = that.getView().getModel().getProperty('/d/results');
				
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


				},
				error: function (error) {
					console.log(error);
					 MessageBox.error(error.responseJSON.errors.error.message.value);
				}

			});

		},
		createColumnConfig: function() {
			var lf_excel = [
				{
					label: 'رقم الموقع',
					property: 'buildingId',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'المحافظة',
					property: 'regionDesc',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'المنطقة',
					property: 'cityDesc',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'الحي',
					property: 'districtDesc',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'اسم الشارع',
					property: 'streetDesc',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'رقم البناية',
					property: 'biuldingNo',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'اقرب معلم',
					property: 'landmark',
					type: EdmType.String,
					scale: 0
				},				
				// {
				// 	label: 'حالة صندوق الاتصالات ',
				// 	property: 'jepcoBoxStatus',
				// 	type: EdmType.String,
				// 	scale: 0
				// },
				{
					label: 'رقم صندوق الالياف الضوئية',
					property: 'commId',
					type: EdmType.String,
					scale: 0
				}, 
				{
					label: 'حالة صندوق الالياف الضوئية',
					property: 'commStatus',
					type: EdmType.String,
					scale: 0
				},	
				{
					label: 'طريقة التوصيل',
					property: 'connectMethod',
					type: EdmType.String,
					scale: 0
				},		
				{
					label: 'رقم العمود',
					property: 'electricPoleId',
					type: EdmType.String,
					scale: 0
				},

				{
					label: 'خط الطول',
					property: 'latitude',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'خط العرض',
					property: 'longitude',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'المستخدم',
					property: 'ui5user',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'التاريخ',
					property: 'transDt',
					type: EdmType.String,
					scale: 0
				}, 	 
				// {
				// 	label: 'رقم الموقع',
				// 	property: 'commstrdtl/results/0/buildingId',
				// 	type: EdmType.String,
				// 	scale: 0
				// }, 
				{
					label: 'رقم الشقة',
					property: 'commstrdtl/results/0/apartmentNo',
					type: EdmType.String,
					scale: 0
				}, 
				{
					label: 'رقم الطابق',
					property: 'commstrdtl/results/0/floorNo',
					type: EdmType.String,
					scale: 0
				}, 
				// {
				// 	label: 'رقم العداد',
				// 	property: 'commstrdtl/results/0/meterNo',
				// 	type: EdmType.String,
				// 	scale: 0
				// }, 																				
				{
					label: 'الرقم الوطني',
					property: 'commstrdtl/results/0/nationalId',
					type: EdmType.String,
					scale: 0
				},				
				{
					label: 'المالك',
					property: 'commstrdtl/results/0/owner',
					type: EdmType.String,
					scale: 0
				} ,				
				{
					label: 'رقم الهاتف',
					property: 'commstrdtl/results/0/phoneNo',
					type: EdmType.String,
					scale: 0
				} , 		
				{
					label: 'وقت التبديل',
					property: 'commstrdtl/results/0/tenantName',
					type: EdmType.String,
					scale: 0
				} ,						
				{
					label: 'تاريخ التبديل',
					property: 'commstrdtl/results/0/transDt',
					type: EdmType.String,
					scale: 0
				} ,				
				{
					label: 'الاسم الاول',
					property: 'commstrdtl/results/0/tnameFrst',
					type: EdmType.String,
					scale: 0
				},			
				{
					label: 'اسم الاب',
					property: 'commstrdtl/results/0/tnameScnd',
					type: EdmType.String,
					scale: 0
				}  ,				
				{
					label: ' اسم الجد',
					property: 'commstrdtl/results/0/tnameThrd',
					type: EdmType.String,
					scale: 0
				}  ,				
				{
					label: ' العائلة',
					property: 'commstrdtl/results/0/tnameFmly',
					type: EdmType.String,
					scale: 0
				}  ,	
				{
					label: 'رقم الملف',
					property: 'commstrdtl/results/1/fileNo',
					type: EdmType.String,
					scale: 0
				}  ,	
				{
					label: 'رقم العداد القديم',
					property: 'commstrdtl/results/1/oldMeterNo',
					type: EdmType.String,
					scale: 0
				}  ,	
				{
					label: 'قراءة الرفع المصدرة',
					property: 'commstrdtl/results/1/oldMeterRDNGI',
					type: EdmType.String,
					scale: 0
				} ,	
				{
					label: 'قراءة الرفع المستورده',
					property: 'commstrdtl/results/1/oldMeterRDNGE',
					type: EdmType.String,
					scale: 0
				} ,	
				{
					label:  'رقم العدادا الجديد',
					property: 'commstrdtl/results/1/newMeterNO',
					type: EdmType.String,
					scale: 0
				} ,	
				{
					label:  'قراءة التركيب المصدرة',
					property: 'commstrdtl/results/1/newMeterRDNGI',
					type: EdmType.String,
					scale: 0
				} ,	
				{
					label:  'قراءة التركيب المستوردة',
					property: 'commstrdtl/results/1/newMeterRDNGE',
					type: EdmType.String,
					scale: 0
				}  ,	
				{
					label:  'نوع الملاحظة',
					property: 'commstrdtl/results/1/noteType',
					type: EdmType.String,
					scale: 0
				}  ,	
				{
					label:  'وصف الملاحظة',
					property: 'commstrdtl/results/1/noteDesc',
					type: EdmType.String,
					scale: 0
				} 
			]    
			return lf_excel;
		}
	});
});