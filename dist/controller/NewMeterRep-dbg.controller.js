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
    var data = ""
    var engTechUser = JSON.parse(localStorage.getItem("engTechUser"))
    //var oUserID = JSON.parse(localStorage.getItem("oUserID"))
    var data = {
        "ui5User": engTechUser,
        "status": [1, 4]
    }
    var data2 = {
        "ui5User": engTechUser,
        "status": [1, 2, 3, 4]
    }
 
	return Controller.extend("Jepco.ISU.DM.smartmeter.controller.NewMeterRep", {
        onNewMeterRepExcelBTNPress: function(){

            var myJsonString = JSON.stringify(data);
            var settings = {
				"async": true,
				"crossDomain": true,
				"url": "https://portal.jepco.com.jo/MeterReplacmentPortalApisPRD/api/TbMeterReplacment/GetAllDataWithoutImages",
				"method": "POST",
				"headers": {
					"content-type": "application/json",
					"cache-control": "no-cache",
				},
				"processData": false,
				"data": myJsonString
			}
            var that = this;
            sap.ui.core.BusyIndicator.show();
			$.ajax(settings).done(function (response) {
				var result = response
				console.log(result);
				for (var key in result) {
					if (result.hasOwnProperty(key)) {
						result[key].deviceCategory = result[key].deviceCategory.replace(/^0+/, '');
						result[key].createdDate = result[key].createdDate.split('T')[0].concat(' ').concat(result[key].createdDate.split('T')[1].substring(0,8))
						result[key].upadateDate = result[key].upadateDate.split('T')[0].concat(' ').concat(result[key].upadateDate.split('T')[1].substring(0,8))
						result[key].ui5User = result[key].ui5User.toUpperCase();
						var status = result[key].status;
						console.log(status)
						if (result[key].status == 1) {
							result[key].status = "بأنتظار الموافقة"
						}
						if (result[key].status == 2) {
							result[key].status = "تمت الموافقة"
						}
						if (result[key].status == 4) {
							result[key].status = "تعليق"
						}
					}
				}
                console.log(result);			
                var oModel = new sap.ui.model.json.JSONModel();
                var oData = result ;
                oModel.setData(oData);
                aProducts = oModel.getProperty('/');
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
 
			});
        },
		createColumnConfig: function() {
			var lf_excel = [  
                {
					label: 'الجولة',
					property: 'mru', 
					scale: 0
				},
                {
					label: 'تاريخ التعين',
					property: 'mruAssignDt', 
					scale: 0
				},
				{
					label: 'رقم الملف',
					property: 'vrefer', 
					scale: 0
				},
				{
					label: 'رابط البيانات',
					property: 'anlage', 
					scale: 0
				},
				{
					label: 'رقم العقد',
					property: 'contract', 
					scale: 0
				},
				{
					label: 'تاريخ الانشاء',
					property: 'createdDate', 
					scale: 0
				},
                {
					label: 'اسم المشترك',
					property: 'customeName', 
					scale: 0
				},
				{
					label: 'رقم التجهيزات',
					property: 'lequnr', 
					scale: 0
				},
                {
					label: 'رقم العداد القديم',
					property: 'geraet', 
					scale: 0
				},
				{
					label: 'القراءة المستجرة ساب',
					property: 'limpMeterRead', 
					scale: 0
				},
				{
					label: 'القراءة المصدرة ساب',
					property: 'lexpMeterRead', 
					scale: 0
				},
                {
					label: 'تاريخ اخر قراءة ساب',
					property: 'lmrDateFormat', 
					scale: 0
				},
                {
					label: 'نوع العداد',
					property: 'meterCats', 
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
					label: 'الفاز',
					property: 'phaz', 
					scale: 0
				},
                {
					label: 'رقم العداد الجديد',
					property: 'rmeterNo', 
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
					label: 'ملاحظة العداد الجديد',
					property: 'newMeterNote', 
					scale: 0
				},
                {
					label: 'ملاحظة العداد القديم',
					property: 'oldMeterNote', 
					scale: 0
				},
                {
					label: 'نوع الاشتراك',
					property: 'ttypbez', 
					scale: 0
				},
                {
					label: 'الفنى',
					property: 'ui5User', 
					scale: 0
				}
 
            ]    
			return lf_excel;
		}
        
	});
});