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
	return Controller.extend("Jepco.ISU.DM.smartmeter.controller.RepReport", {

		onReplaceExcelRepBTNPress: function(){ 
			var lv_year = this.getView().byId("idRepDateFm").getDateValue().getFullYear();
			var lv_month = this.getView().byId("idRepDateFm").getDateValue().getMonth() + 1 ;
			lv_month = lv_month.toString().length < 2 ?  ("0" + lv_month.toString() ) : lv_month.toString();
			var lv_day = this.getView().byId("idRepDateFm").getDateValue().getDate();
			lv_day = lv_day.toString().length < 2 ?  ("0" + lv_day.toString() ) : lv_day.toString();
			var datefm = [lv_year, lv_month, lv_day].join('')		 

			lv_year = this.getView().byId("idRepDateTo").getDateValue().getFullYear();
			lv_month = this.getView().byId("idRepDateTo").getDateValue().getMonth() + 1 ;
			lv_month = lv_month.toString().length < 2 ?  ("0" + lv_month.toString() ) : lv_month.toString();
			lv_day = this.getView().byId("idRepDateTo").getDateValue().getDate();
			lv_day = lv_day.toString().length < 2 ?  ("0" + lv_day.toString() ) : lv_day.toString();
			var dateto = [lv_year, lv_month, lv_day].join('');
			var builUser = this.getView().byId("idRepBuildUser").getValue();
			var dateFm = datefm.replace(/[-]/g, '') ;
			var dateTo = dateto.replace(/[-]/g, '') ;
			if(builUser == '') {
				builUser = "ALL"
			};
            var flg = 'P'
			var payload = flg +  dateFm +   dateTo + builUser; 
			var that = this;
			$.ajax({
				type: 'POST',
				url: "https://portal.jepco.com.jo/JepcoSAPProxyPRD/SapProxy/GetDuplicates" ,
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
					}
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

		} ,
		createColumnConfig: function() {
			var lf_excel = [
				{
					label: 'المستخدم',
					property: 'ui5User',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'رقم الملف',
					property: 'vrefer',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'رقم العقد',
					property: 'contract',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'رابط البيانات',
					property: 'anlage',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'اسم المشترك',
					property: 'customeName',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'نوع الاشتراك',
					property: 'ttypbez',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'رقم التجهيزات',
					property: 'lequnr',
					type: EdmType.String,
					scale: 0
				},				
				{
					label: 'تاريخ التبديل',
					property: 'actdate',
					type: EdmType.String,
					scale: 0
				}, 
				{
					label: 'وقت التبديل',
					property: 'acttime',
					type: EdmType.String,
					scale: 0
				},	
				{
					label: 'رقم العداد القديم',
					property: 'geraet',
					type: EdmType.String,
					scale: 0
				},		
				{
					label:   'قراءة الرفع المستوده'     ,
					property: 'oimpMeterRead',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'قراءة الرفع المصدرة',
					property: 'oexpMeterRead',
					type: EdmType.String,
					scale: 0
				},
                {
					label: 'رقم العداد الجديد',
					property: 'rmeterNo',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'قراءة التركيب المستوده',
					property: 'rimpMeterRead',
					type: EdmType.String,
					scale: 0
				}, 	 
				{
					label: 'قراءة التركيب المصدرة',
					property: 'rexpMeterRead',
					type: EdmType.String,
					scale: 0
				}
				//  ,
				// {
				// 	label: 'خط الطول',
				// 	property: 'latitude',
				// 	type: EdmType.String,
				// 	scale: 0
				// },
				// {
				// 	label: 'خط العرض',
				// 	property: 'longitude',
				// 	type: EdmType.String,
				// 	scale: 0
				// }
			] 

			return lf_excel;
		}             
	});
});