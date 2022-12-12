sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/ButtonType",
  ],
  function (
    Controller,
    BusyIndicator,
    MessageBox,
    Sorter,
    Filter,
    FilterOperator,
    FilterType,
    JSONModel,
    Dialog,
    Button,
    ButtonType
  ) {
    "use strict";

    var data = "";
    var engTechUser = JSON.parse(localStorage.getItem("engTechUser"));
    //var oUserID = JSON.parse(localStorage.getItem("oUserID"))
    var data = {
      ui5User: engTechUser,
      status: [1, 4],
    };
    var data2 = {
      ui5User: engTechUser,
      status: [1, 2, 3, 4],
    };

    var myJsonString = JSON.stringify(data);
    var myJsonString2 = JSON.stringify(data2);

    var note = "";
    return Controller.extend("Jepco.ISU.DM.smartmeter.controller.Main", {
      ui5UserModele: sap.ui.getCore().getModel("userModel"),

      onBuildingReportPress: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("Report");
      },
      onStandardReportPress: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("StandRep");
      },
      onNewMeterReportPress: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("NewMeterRep");
      },
      onSuggest: function (oEvent) {
        //   var oMRUModel = new sap.ui.model.json.JSONModel();
        //   oMRUModel.loadData("model/mruData.json");
        //   this.getView().setModel(oMRUModel);
      },
      onReplacementReportPress: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RepReport");
      },
      onQueryRound: function () {
        var rsURL =
          "https://portal.jepco.com.jo/JepcoSAPProxy/SapProxy/GetDuplicates";
        var rond = this.getView().byId("teamRound").getValue();
        //var usr  = this.getView().byId("teamName").getValue();
        var usr = this.getView().byId("teamName").getSelectedItem()
          .mProperties.text;
        usr = usr.toUpperCase();
        if (rond == "" && usr == "") {
          MessageBox.alert(
            "الرجاء ادخال اسم المستخدم للفرقة الفنية او رقم الجولة	"
          );
          return;
        }
        var qrtPayload = "QRY-" + usr + "-" + rond;
        let that = this;
        $.ajax({
          type: "POST",
          url: rsURL,
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify({
            strMeterNumber: qrtPayload,
          }),
          success: function (data, status, response) {
            console.log(data, status, response);
            if (data.d.results.length == "0") {
              MessageBox.show("لا يوجد جولة مخصصة ");
            }
            var oData = data;
            var oTable = that.getView().byId("idTableRound");

            var oModel = new sap.ui.model.json.JSONModel();

            oModel.setData(oData);
            console.log(oModel);

            oTable.setModel(oModel);

            var oJSONData = {
              busy: false,
              order: 0,
            };
            var oModel = new JSONModel(oJSONData);
            that.getView().setModel(oModel, "appView");
          },
          error: function (error) {
            if (error.status == "200") MessageBox.confirm("تم الحفظ بنجاح");
            else
              MessageBox.alert(error.responseJSON.errors.error.message.value);
          },
        });
      },
      onQueryRoundChk: function () {
        var rsURL =
          "https://portal.jepco.com.jo/JepcoSAPProxy/SapProxy/GetDuplicates";
        var rond = "";
        //var usr  = this.getView().byId("teamName").getValue();
        var usr = this.getView().byId("teamName").getSelectedItem()
          .mProperties.text;
        usr = usr.toUpperCase();
        // if (rond == '' && usr == '') {
        // 	MessageBox.alert("الرجاء ادخال اسم المستخدم للفرقة الفنية او رقم الجولة	");
        // 	return;
        // }
        var qrtPayload = "QRY-" + usr + "-" + rond;
        let that = this;
        $.ajax({
          type: "POST",
          url: rsURL,
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify({
            strMeterNumber: qrtPayload,
          }),
          success: function (data, status, response) {
            console.log(data, status, response);
            var oData = data;
            var oTable = that.getView().byId("idTableRound");

            //   var oModel1 = new sap.ui.model.json.JSONModel();
            //   var data =[];
            //   oModel1.setData(data);
            //   var aData = oModel1.getProperty("/d/results");
            //   oModel1.setData({ modelData : aData });
            //   oTable.setModel(oModel1, "odata");

            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(oData);
            console.log(oModel);
            oTable.setModel(oModel);
            var oJSONData = {
              busy: false,
              order: 0,
            };
            var oModel = new JSONModel(oJSONData);
            that.getView().setModel(oModel, "appView");
          },
          error: function (error) {
            // if (error.status == '200')
            //  MessageBox.confirm("تم الحفظ بنجاح");
            // else
            // MessageBox.alert(error.responseJSON.errors.error.message.value);
          },
        });
      },
      onDeleteRound: function () {
        var ui5UserApp = sap.ui
          .getCore()
          .getModel()
          .getProperty("/globalData/oUserName");
        var engUserName = "RONDD-" + ui5UserApp;
        var rsURL =
          "https://portal.jepco.com.jo/JepcoSAPProxy/SapProxy/InsertTechNote";
        var rond = this.getView().byId("teamRound").getValue();
        //var usr  = this.getView().byId("teamName").getValue();
        var usr = this.getView().byId("teamName").getSelectedItem()
          .mProperties.text;
        if (rond == "" || usr == "") {
          MessageBox.alert(
            "الرجاء ادخال اسم المستخدم للفرقة الفنية ورقم الجولة	"
          );
          return;
        }
        let that = this;
        $.ajax({
          type: "POST",
          url: rsURL,
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify({
            Geraet: engUserName,
            TarifDesc: "0",
            Tariftyp: "0",
            ImpimageOm: "0",
            ui5User: usr,
            DuplicateAddr: rond,
          }),
          success: function (data, status, response) {
            console.log(data, status, response);
            that.onQueryRoundChk();
            MessageBox.confirm("تمت عملية الحذف بنجاح");
          },
          error: function (error) {
            if (error.status == "200") {
              that.onQueryRoundChk();
              MessageBox.confirm("تمت عملية الحذف بنجاح");
            } else
              MessageBox.alert(error.responseJSON.errors.error.message.value);
          },
        });
      },
      onSaveRound: function () {
        var ui5UserApp = sap.ui
          .getCore()
          .getModel()
          .getProperty("/globalData/oUserName");
        var engUserName = "RONDS-" + ui5UserApp;
        var rsURL =
          "https://portal.jepco.com.jo/JepcoSAPProxy/SapProxy/InsertTechNote";
        var rond = this.getView().byId("teamRound").getValue();
        //var usr  = this.getView().byId("teamName").getValue();
        var usr = this.getView().byId("teamName").getSelectedItem()
          .mProperties.text;
        if (rond == "" || usr == "") {
          MessageBox.alert(
            "الرجاء ادخال اسم المستخدم للفرقة الفنية ورقم الجولة	"
          );
          return;
        }
        let that = this;
        $.ajax({
          type: "POST",
          url: rsURL,
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify({
            Geraet: engUserName.toUpperCase(),
            TarifDesc: "0",
            Tariftyp: "0",
            ImpimageOm: "0",
            ui5User: usr,
            DuplicateAddr: rond,
          }),
          success: function (data, status, response) {
            console.log(data, status, response);
            that.onQueryRoundChk();
            MessageBox.confirm("تم الحفظ بنجاح");
          },
          error: function (error) {
            if (error.status == "200") {
              that.onQueryRoundChk();
              MessageBox.confirm("تم الحفظ بنجاح");
            } else
              MessageBox.alert(error.responseJSON.errors.error.message.value);
          },
        });
      },
      onShowAll: function () {
        var rsURL =
          "https://portal.jepco.com.jo/JepcoSAPProxy/SapProxy/GetDuplicates";
        var usr = "ALL";
        var qrtPayload = "QALL";
        let that = this;
        $.ajax({
          type: "POST",
          url: rsURL,
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify({
            strMeterNumber: qrtPayload,
          }),
          success: function (data, status, response) {
            console.log(data, status, response);
            var oData = data;
            var oTable = that.getView().byId("idTableRound");

            var oModel = new sap.ui.model.json.JSONModel();

            oModel.setData(oData);
            console.log(oModel);

            oTable.setModel(oModel);

            var oJSONData = {
              busy: false,
              order: 0,
            };
            var oModel = new JSONModel(oJSONData);
            that.getView().setModel(oModel, "appView");
          },
          error: function (error) {
            if (error.status == "200") MessageBox.confirm("تم الحفظ بنجاح");
            else
              MessageBox.alert(error.responseJSON.errors.error.message.value);
          },
        });
      },
      onNotePicPress: function (oEvent) {
        console.log(oEvent.getSource().getBindingContext().getPath());
        var lineNumber = oEvent.getSource().getBindingContext().getPath();
        console.log("lineNumber = ", lineNumber);
        lineNumber = lineNumber.substring(1);
        var techNoteId = this.getView().byId("idTechnicalNotes").getModel()
          .oData[lineNumber].id;
        var noteURL =
          "https://portal.jepco.com.jo/MeterReplacmentPortalApis/api/TbTechnicalNotesAndIncident/GetNotesByID?ID=" +
          techNoteId +
          "";
        let that = this;
        $.ajax({
          type: "GET",
          url: noteURL,
          dataType: "json",
          contentType: "application/json",
          success: function (data, status, response) {
            console.log(data, status, response);
            var src1 = data[0].image;

            //oEvent.getSource().mProperties.src

            var flexbox = new sap.m.HBox({
              alignItems: "Center",
              wrap: "Wrap",
              justifyContent: "Start",
              items: [
                new sap.m.Image({
                  src: src1,
                  alt: "Tech Note image",
                  height: "500px",
                  mode: "Image",
                  width: "600px",
                }),
              ],
            });
            this.oDefaultDialog = new Dialog({
              title: "الصورة",
              content: [
                new sap.ui.layout.form.SimpleForm({
                  editable: false,
                  layout: "ResponsiveGridLayout",
                  content: [flexbox],
                }),
              ],
              endButton: new Button({
                text: "Close",
                press: function () {
                  this.oDefaultDialog.close();
                  this.oDefaultDialog.destroyContent();
                }.bind(this),
              }),
            });
            //	this.getView().addDependent(this.oDefaultDialog);
            this.oDefaultDialog.open();
          },
          error: function (error) {
            console.log(error);
          },
        });
      },
      /** whene load page  get all Meter and show in table*/
      _handleRouteMatched: function (oEvent) {
        let that = this;
        console.log("array engTechUser ", engTechUser);
        engTechUser = JSON.parse(localStorage.getItem("engTechUser"));

        //"https://portal.jepco.com.jo/MeterReplacmentPortalApis/api/TbMeterReplacment/GetAllDataID",
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // $.ajax({
        // 	type: "POST",
        // 	url: "https://portal.jepco.com.jo/MeterReplacmentPortalApis/api/TbMeterReplacment/GetAllDataWithoutImages",
        // 	dataType: "json",
        // 	contentType: "application/json",
        // 	data: JSON.stringify({
        // 		"ui5User": [
        // 		  "rarab",
        // 		  "rafat"
        // 		],
        // 		"status": [
        // 		  1,
        // 		  4
        // 		]
        // 	  }),
        // 	success: function (data, status, response) {
        // 		console.log(data);
        // 		console.log(status);
        // 		console.log(response);
        // 	},
        // 	error: function (error) {
        // 		console.log(error);
        // 	}
        // });
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var settings = {
          async: true,
          crossDomain: true,
          url: "https://portal.jepco.com.jo/MeterReplacmentPortalApis/api/TbMeterReplacment/GetAllDataWithoutImages",
          method: "POST",
          headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
          },
          processData: false,
          data: myJsonString,
        };

        $.ajax(settings).done(function (response) {
          var result = response;
          if (result.length > 999) {
            that.getView().byId("idTabNewMeter").setCount("+999");
          } else {
            that.getView().byId("idTabNewMeter").setCount(result.length);
          }
          console.log(result);

          for (var key in result) {
            if (result.hasOwnProperty(key)) {
              result[key].deviceCategory = result[key].deviceCategory.replace(
                /^0+/,
                ""
              );
              // here you have access to
              //result[key].createdDate = result[key].createdDate.split('T')[0];
              result[key].createdDate = result[key].createdDate
                .split("T")[0]
                .concat(" ")
                .concat(result[key].createdDate.split("T")[1].substring(0, 8));
              //                         result[3  ].createdDate.split('T')[0].concat(' ').concat(result[3  ].createdDate.split('T')[1].substring(0,8))
              //result[key].upadateDate = result[key].upadateDate.split('T')[0];
              result[key].upadateDate = result[key].upadateDate
                .split("T")[0]
                .concat(" ")
                .concat(result[key].upadateDate.split("T")[1].substring(0, 8));
              result[key].ui5User = result[key].ui5User.toUpperCase();
              var status = result[key].status;
              console.log(status);
              if (result[key].status == 1) {
                result[key].status = "بأنتظار الموافقة";
              }
              if (result[key].status == 2) {
                result[key].status = "تمت الموافقة";
              }

              // if (result[key].status == 3) {
              // 	result[key].status = "Reject"
              // }
              if (result[key].status == 4) {
                result[key].status = "تعليق";
              }
            }
          }
          data = result;
          var oTable = that.getView().byId("idTableOffline");

          var oModel = new sap.ui.model.json.JSONModel();

          oModel.setData(data);
          console.log(oModel);

          oTable.setModel(oModel);

          var oJSONData = {
            busy: false,
            order: 0,
          };
          var oModel = new JSONModel(oJSONData);
          that.getView().setModel(oModel, "appView");
        });
        // OLD API SHOPYARD :"https://portal.jepco.com.jo/MeterReplacmentPortalApis/api/TbMeterReplacment/GetAllDataID",
        var settings = {
          async: true,
          crossDomain: true,
          url: "https://portal.jepco.com.jo/MeterReplacmentPortalApis/api/TbMeterReplacment/GetAllDataWithoutImages",

          method: "POST",
          headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
          },
          processData: false,
          data: myJsonString2,
        };

        $.ajax(settings).done(function (response) {
          var result = response;
          console.log(result);
          if (result.length > 999) {
            that.getView().byId("idTabOtherMeter").setCount("+999");
          } else {
            that.getView().byId("idTabOtherMeter").setCount(result.length);
          }
          for (var key in result) {
            if (result.hasOwnProperty(key)) {
              //    result[key].createdDate = result[key].createdDate.split('T')[0].concat(' ').concat(result[key].createdDate.split('T')[1].substring(0,8))
              //    result[key].upadateDate = result[key].upadateDate.split('T')[0].concat(' ').concat(result[key].upadateDate.split('T')[1].substring(0,8))

              result[key].createdDate = result[key].createdDate.split("T")[0];
              result[key].upadateDate = result[key].upadateDate.split("T")[0];
              //result[key].upadateDate = result[key].upadateDate.split('T')[0] + ' ( '  + result[key].upadateDate.split('T')[0].split('.')[0] + ' )'
              result[key].ui5User = result[key].ui5User.toUpperCase();
              result[key].updateBy = result[key].updateBy.toUpperCase();

              var status = result[key].status;
              console.log(status);
              if (result[key].status == 1) {
                result[key].status = "بأنتظار الموافقة";
              }
              if (result[key].status == 2) {
                result[key].status = "تمت الموافقة";
              }

              // if (result[key].status == 3) {
              // 	result[key].status = "Reject"
              // }
              if (result[key].status == 4) {
                result[key].status = "تعليق";
              }
            }
          }
          data = result;
          var oTable2 = that.getView().byId("idTableOtherMeter");

          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData(data);
          oTable2.setModel(oModel);

          var oJSONData = {
            busy: false,
            order: 0,
          };
          var oModel = new JSONModel(oJSONData);
          that.getView().setModel(oModel, "appView");
        });

        var ui5UserPayload = [];
        var tmpUi5 = {};
        for (let i = 0; i < engTechUser.length; i++) {
          tmpUi5 = { ui5User: engTechUser[i] };
          ui5UserPayload.push(tmpUi5);
        }

        let oUserID = sap.ui
          .getCore()
          .getModel()
          .getProperty("/globalData/oUserName");
        console.log("oUserID---------------------------" + oUserID);
        var payload = "UAN" + "-" + oUserID;

        var aItems = [];

        //	 let url = "http://85.159.218.156:8000/sap/opu/odata/sap/ZCOMMDTL_SRV/ZENG_USERSet?$filter=startswith(EngTechUser,'" + payload + "')&$format=json"
        $.ajax({
          type: "POST",
          url: "https://portal.jepco.com.jo/JepcoSAPProxy/SapProxy/GetEng_MeterSet",
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify({
            strEngUserName: payload,
          }),
          success: function (data, status, response) {
            var results = response.responseJSON.d.results;
            for (const key in results) {
              // console.log(results[key].engTechUser);
              // for(let i = 0; i <= results.length-1; i++){
              aItems.push({
                firstColumnText: results[key].engTechUser.split("-")[0],
                secondColumnText: results[key].engTechUser.split("-")[1],
              });
              var oModel = new sap.ui.model.json.JSONModel({ items: aItems });
              that.getView().setModel(oModel, "userModel");
              //	}
            }
          },
          error: function (error) {},
        });

        //sap.ui.getCore().getModel("ui5UserModele")
        var settings = {
          async: true,
          crossDomain: true,
          url: "https://portal.jepco.com.jo/MeterReplacmentPortalApis/api/TbTechnicalNotesAndIncident/GetNotesByUi5UserIds",
          method: "POST",
          headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "postman-token": "ab0289cd-5f6f-07d0-2596-e05cebc7bc4b",
          },
          processData: false,
          data: JSON.stringify(ui5UserPayload),
        };

        $.ajax(settings).done(function (response) {
          console.log(response);
          for (var key in response) {
            if (response.hasOwnProperty(key)) {
              response[key].createdDate =
                response[key].createdDate.split("T")[0];
              response[key].ui5User = response[key].ui5User.toUpperCase();

              var tarifDesc = response[key].tarifDesc;
              console.log(tarifDesc);
              if (response[key].tarifDesc == 1) {
                response[key].tarifDesc = "ملاحظات خاصة بالخزانة الكهربائية";
              }
              if (response[key].tarifDesc == 2) {
                response[key].tarifDesc = "ملاحظات خاصة بالعداد";
              }
              if (response[key].tarifDesc == 3) {
                response[key].tarifDesc = "عبث";
              }
              if (response[key].tarifDesc > 3) {
                response[key].tarifDesc = "ملاحظات اخرى";
              }
            }
          }
          note = response;
          var oTable3 = that.getView().byId("idTechnicalNotes");

          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData(note);
          oTable3.setModel(oModel);

          var oJSONData = {
            busy: false,
            order: 0,
          };
          var oModel = new JSONModel(oJSONData);
          that.getView().setModel(oModel, "appView");
        });
      },
      onInit: function () {
        var router = sap.ui.core.UIComponent.getRouterFor(this);
        router.attachRoutePatternMatched(this._handleRouteMatched, this);
      },
      /** whene click btn refresh in table  get all Meter and show in table*/
      onRefresh: function () {
        let that = this;
        that._handleRouteMatched();
      },
      /** whene click btn show more go anther page and show info for Meter*/
      onShowMore: function (oEvent) {
        var idtabVar = this.getView().byId("idIconTabBar").getSelectedKey();
        // this.getView().byId("idIconTabBar").sId.split('--').pop();
        var chkTabID = { idTab: idtabVar };
        var jsonModelTab = new sap.ui.model.json.JSONModel(chkTabID);
        this.getOwnerComponent().setModel(jsonModelTab, "chkTabID");
        //this.getView().setModel(jsonModelTab,"chkTabID");
        //this.getView().byId("idTabOtherMeter").sId.split('--').pop()
        var oButton = oEvent.getSource();
        var oBindingContext = oButton.getBindingContext(); // <<<-- If you have model name pass it here as string
        var oBindingObject = oBindingContext.getObject(); // getPath() method gives path to model row number

        var that = this;
        let urlByID =
          "https://portal.jepco.com.jo/MeterReplacmentPortalApis/api/TbMeterReplacment/GetMeterReplacmentByID?ID=" +
          oBindingObject.id +
          "";
        $.ajax({
          type: "GET",
          url: urlByID,
          dataType: "json",
          contentType: "application/json",
          success: function (data, status, response) {
            data[0].deviceCategory = data[0].deviceCategory.replace(/^0+/, "");
            console.log(data);
            console.log(status);
            console.log(response);

            oBindingObject.impimageNm = data[0].impimageNm;
            oBindingObject.impimageOm = data[0].impimageOm;
            oBindingObject.expimageNm = data[0].expimageNm;
            oBindingObject.expimageOm = data[0].expimageOm;

            var oModel = new sap.ui.model.json.JSONModel(oBindingObject);

            that.getOwnerComponent().setModel(oModel, "MoreInfoData");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            oRouter.navTo("MoreInfo");
          },
          error: function (error) {
            console.log(error);
          },
        });
        // var oModel = new sap.ui.model.json.JSONModel(data);
        // //var oModel = new sap.ui.model.json.JSONModel(oBindingObject);
        // this.getOwnerComponent().setModel(oModel, "MoreInfoData");

        // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        // oRouter.navTo("MoreInfo");
      },
      // onSearchNewMeter: function(){
      // 	var Searcholdmeter1 = this.getView().byId("searchNewMeter").getValue();
      // 	var dataOld = {
      // 		"MeterNumber": Searcholdmeter1,
      // 		"OldMeterFalg": 0
      // 	}

      // 	var myJsonSearchOld = JSON.stringify(dataOld);

      // 	var settings = {
      // 		"async": true,
      // 		"crossDomain": true,
      // 		"url": "https://portal.jepco.com.jo/MeterReplacmentPortalApis/api/TbMeterReplacment/GetMeterReplacmentByMeterNumber?MeterNumber="+Searcholdmeter1+"&OldMeterFalg=0",
      // 		"method": "GET",
      // 		"headers": {
      // 			"content-type": "application/json",
      // 			"cache-control": "no-cache",
      // 		},
      // 		"processData": false ,
      // 		"data": myJsonSearchOld
      // 	}
      // 	var that = this;
      // 	BusyIndicator.show();
      // 	$.ajax(settings).done(function (response) {
      // 		var result = response
      // 		console.log(result);
      // 		if(result.length == "0"){
      // 			MessageBox.error("رقم العداد غير موجود");
      // 			BusyIndicator.hide();
      // 			return
      // 		}

      // 		for (var key in result) {
      // 			if (result.hasOwnProperty(key)) {
      // 				result[key].createdDate = result[key].createdDate.split('T')[0].concat(' ').concat(result[key].createdDate.split('T')[1].substring(0,8))
      // 				result[key].upadateDate = result[key].upadateDate.split('T')[0].concat(' ').concat(result[key].upadateDate.split('T')[1].substring(0,8))
      // 				result[key].ui5User = result[key].ui5User.toUpperCase();
      // 				var status = result[key].status;
      // 				console.log(status)
      // 				if (result[key].status == 1) {
      // 					result[key].status = "بأنتظار الموافقة"
      // 				}
      // 				if (result[key].status == 2) {
      // 					result[key].status = "تمت الموافقة"
      // 				}
      // 				if (result[key].status == 4) {
      // 					result[key].status = "تعليق"
      // 				}
      // 			}
      // 		}
      // 		data = result
      // 		var oTable = that.getView().byId("idTableOffline");
      // 		var oModel = new sap.ui.model.json.JSONModel();
      // 		oModel.setData(data);
      // 		console.log(oModel)
      // 		oTable.setModel(oModel);
      // 		var oJSONData = {
      // 			busy: false,
      // 			order: 0
      // 		};
      // 		var oModel = new JSONModel(oJSONData);
      // 		that.getView().setModel(oModel, "appView");
      // 		that.getView().byId("searchNewMeter").setValue("");
      // 		BusyIndicator.hide();
      // 	});
      //  },
	  onShowButton:function name(oEvent) {
	let valueRD=this.getView().byId("rbg").getSelectedButton();
	alert(valueRD);
	},
      onSearchMeter: function (oEvent) {
        var oflg = 1;
        let lv_oEvent = oEvent.getParameter("id").split("--").pop();
        if (oEvent.getParameter("id").split("--").pop() == "searchOldMeter") {
          var Searcholdmeter1 = this.getView()
            .byId("searchOldMeter")
            .getValue();
          oflg = 1;
        }
        if (oEvent.getParameter("id").split("--").pop() == "searchNewMeter") {
          var Searcholdmeter1 = this.getView()
            .byId("searchNewMeter")
            .getValue();
          oflg = 0;
        }
        if (
          oEvent.getParameter("id").split("--").pop() == "searchOldMeterAll"
        ) {
          var Searcholdmeter1 = this.getView()
            .byId("searchOldMeterAll")
            .getValue();
          oflg = 1;
        }
        if (
          oEvent.getParameter("id").split("--").pop() == "searchNewMeterAll"
        ) {
          var Searcholdmeter1 = this.getView()
            .byId("searchNewMeterAll")
            .getValue();
          oflg = 0;
        }

        var dataOld = {
          MeterNumber: Searcholdmeter1,
          OldMeterFalg: oflg,
        };

        var myJsonSearchOld = JSON.stringify(dataOld);

        var settings = {
          async: true,
          crossDomain: true,
          url:
            "https://portal.jepco.com.jo/MeterReplacmentPortalApis/api/TbMeterReplacment/GetMeterReplacmentByMeterNumber?MeterNumber=" +
            Searcholdmeter1 +
            "&OldMeterFalg=" +
            oflg,
          method: "GET",
          headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
          },
          processData: false,
          data: myJsonSearchOld,
        };
        if (
          lv_oEvent == "searchOldMeterAll" ||
          lv_oEvent == "searchNewMeterAll"
        ) {
          var oTable = this.getView().byId("idTableOtherMeter");
        } else {
          oTable = this.getView().byId("idTableOffline");
        }
        var that = this;

        BusyIndicator.show();
        $.ajax(settings).done(function (response) {
          var result = response;
          console.log(result);
          if (result.length == "0") {
            MessageBox.error("رقم العداد غير موجود");
            that.getView().byId("searchOldMeter").setValue("");
            that.getView().byId("searchNewMeter").setValue("");
            that.getView().byId("searchOldMeterAll").setValue("");
            that.getView().byId("searchNewMeterAll").setValue("");
            BusyIndicator.hide();
            return;
          }

          for (var key in result) {
            if (result.hasOwnProperty(key)) {
              result[key].createdDate = result[key].createdDate
                .split("T")[0]
                .concat(" ")
                .concat(result[key].createdDate.split("T")[1].substring(0, 8));
              result[key].upadateDate = result[key].upadateDate
                .split("T")[0]
                .concat(" ")
                .concat(result[key].upadateDate.split("T")[1].substring(0, 8));
              result[key].ui5User = result[key].ui5User.toUpperCase();
              var status = result[key].status;
              console.log(status);
              if (result[key].status == 1) {
                result[key].status = "بأنتظار الموافقة";
              }
              if (result[key].status == 2) {
                result[key].status = "تمت الموافقة";
              }
              if (result[key].status == 4) {
                result[key].status = "تعليق";
              }
            }
          }
          data = result;

          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData(data);
          console.log(oModel);
          oTable.setModel(oModel);
          var oJSONData = {
            busy: false,
            order: 0,
          };
          var oModel = new JSONModel(oJSONData);
          that.getView().setModel(oModel, "appView");
          that.getView().byId("searchOldMeter").setValue("");
          that.getView().byId("searchNewMeter").setValue("");
          that.getView().byId("searchOldMeterAll").setValue("");
          that.getView().byId("searchNewMeterAll").setValue("");
          BusyIndicator.hide();
        });
      },

      /** sort table by status */

      onSort: function () {
        var oView = this.getView(),
          aStates = ["asc", "desc"],
          aStateTextIds = ["sortNone", "sortAscending", "sortDescending"],
          sMessage,
          iOrder = oView.getModel("appView").getProperty("/order");

        iOrder = (iOrder + 1) % aStates.length;
        var sOrder = aStates[iOrder];

        oView.getModel("appView").setProperty("/order", iOrder);
        oView
          .byId("idTableOffline")
          .getBinding("items")
          .sort(sOrder && new Sorter("status", sOrder === "desc"));
        oView
          .byId("idTableOtherMeter")
          .getBinding("items")
          .sort(sOrder && new Sorter("status", sOrder === "desc"));
      },
      onSortByDate: function () {
        // sort by date
        var oView = this.getView(),
          aStates = ["asc", "desc"],
          //aStates = [undefined, "asc", "desc"],
          aStateTextIds = ["sortNone", "sortAscending", "sortDescending"],
          sMessage,
          iOrder = oView.getModel("appView").getProperty("/order");

        iOrder = (iOrder + 1) % aStates.length;
        var sOrder = aStates[iOrder];

        oView.getModel("appView").setProperty("/order", iOrder);
        oView
          .byId("idTechnicalNotes")
          .getBinding("items")
          .sort(sOrder && new Sorter("createdDate", sOrder === "asc"));
        ////////////////////////////////////////////////////
      },
      /** sort table by ui5User */
      onSortUi5User: function () {
        var oView = this.getView(),
          aStates = ["asc", "desc"],
          //aStates = [undefined, "asc", "desc"],
          aStateTextIds = ["sortNone", "sortAscending", "sortDescending"],
          sMessage,
          iOrder = oView.getModel("appView").getProperty("/order");

        iOrder = (iOrder + 1) % aStates.length;
        var sOrder = aStates[iOrder];

        oView.getModel("appView").setProperty("/order", iOrder);
        oView
          .byId("idTechnicalNotes")
          .getBinding("items")
          .sort(sOrder && new Sorter("ui5User", sOrder === "desc"));
      },

      onSortUser: function () {
        var oView = this.getView(),
          //aStates = [undefined, "asc", "desc"],
          aStates = ["asc", "desc"],
          aStateTextIds = ["sortNone", "sortAscending", "sortDescending"],
          sMessage,
          iOrder = oView.getModel("appView").getProperty("/order");

        iOrder = (iOrder + 1) % aStates.length;
        var sOrder = aStates[iOrder];

        oView.getModel("appView").setProperty("/order", iOrder);
        oView
          .byId("idTableOffline")
          .getBinding("items")
          .sort(sOrder && new Sorter("ui5User", sOrder === "desc"));
        oView
          .byId("idTableOtherMeter")
          .getBinding("items")
          .sort(sOrder && new Sorter("ui5User", sOrder === "desc"));
      },
      /** sort table by createdDate */

      onCreatedDate: function () {
        var oView = this.getView(),
          aStates = ["asc", "desc"],
          aStateTextIds = ["sortAscending", "sortDescending"],
          sMessage,
          iOrder = oView.getModel("appView").getProperty("/order");

        iOrder = (iOrder + 1) % aStates.length;
        var sOrder = aStates[iOrder];

        oView.getModel("appView").setProperty("/order", iOrder);
        oView
          .byId("idTableOffline")
          .getBinding("items")
          .sort(sOrder && new Sorter("createdDate", sOrder === "desc"));
        oView
          .byId("idTableOtherMeter")
          .getBinding("items")
          .sort(sOrder && new Sorter("createdDate", sOrder === "desc"));
      },
      onscanDate: function () {
        var oView = this.getView(),
          aStates = ["asc", "desc"],
          aStateTextIds = ["sortNone", "sortAscending", "sortDescending"],
          sMessage,
          iOrder = oView.getModel("appView").getProperty("/order");

        iOrder = (iOrder + 1) % aStates.length;
        var sOrder = aStates[iOrder];

        oView.getModel("appView").setProperty("/order", iOrder);
        oView
          .byId("idTableOffline")
          .getBinding("items")
          .sort(sOrder && new Sorter("scandt", sOrder === "desc"));
        oView
          .byId("idTableOtherMeter")
          .getBinding("items")
          .sort(sOrder && new Sorter("scandt", sOrder === "desc"));
      },

      /** zoom image */
      onEnterItems: function (oEvent) {
        console.log(oEvent.getSource().mProperties.src);
        var src = oEvent.getSource().mProperties.src;
        var flexbox = new sap.m.HBox({
          alignItems: "Center",
          wrap: "Wrap",
          justifyContent: "Start",
          items: [
            new sap.m.Image({
              id: "image_not_decorative",
              src: src,
              alt: "test image",
              decorative: false,
            }),
          ],
        });
        this.oDefaultDialog = new Dialog({
          title: "الصورة",
          content: [
            new sap.ui.layout.form.SimpleForm({
              editable: false,
              layout: "ResponsiveGridLayout",
              content: [flexbox],
            }),
          ],
          endButton: new Button({
            text: "Close",
            press: function () {
              this.oDefaultDialog.close();
              this.oDefaultDialog.destroyContent();
            }.bind(this),
          }),
        });
        this.getView().addDependent(this.oDefaultDialog);
        this.oDefaultDialog.open();
      },
    });
  }
);
