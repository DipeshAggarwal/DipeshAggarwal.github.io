$(document).ready( function () {
    var sheetID;
    var sheetName;
    var pageLength = 15;
    const urlParams = new URLSearchParams(window.location.search);

    if ( urlParams.get("sheet") ) {
        sheetID = urlParams.get("sheet");
    } else {
        sheetID = "19PBIps8-1k4jEjEv8iRH6DQp1IsVZlYCBwninqSxYNg";
    };
    if ( urlParams.get("page") ) {
        sheetName = urlParams.get("page");
    } else {
        sheetName = "Sheet1";
    };

    // If a length query is given, show that many entries per page
    if ( urlParams.get("length") ) {
        // Ensure that the provided value is string
        if ( !(isNaN(urlParams.get("length"))) ) {
            pageLength = parseInt(urlParams.get("length"));
        }
    };

    Tabletop.init( {
        key: sheetID
    })
    .then(function(data, tabletop) { 
        const queryArray = data[sheetName].columnNames;
        
        sheetData = data[sheetName].elements;
        columnObj = [{"orderable": false,"data": null,"defaultContent": ''}];
        for (var name of queryArray) {
            $("#firstRow").append("<th>" + name +"</th>")
            columnObj.push({"mDataProp": name})
        }

        var table = $('#orderTable').DataTable({
            "responsive": {
                details: {
                    type: 'column',
                    target: 'tr',
                    renderer: function ( api, rowIdx, columns ) {
                        var data = $.map( columns, function ( col, i ) {
                            if (col.hidden && col.data) {
                                if (col.data.includes("http")) {
                                    return '<tr data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
                                        '<td>'+col.title+':'+'</td> '+
                                        '<td style="color:blue;cursor:pointer;width:80%;" onClick=' + 'window.open("'+col.data+'")>'+col.data+'</td>'+
                                    '</tr>';
                                } else {
                                    return '<tr data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
                                        '<td>'+col.title+':'+'</td> '+
                                        '<td style="white-space:initial;">'+col.data+'</td>'+
                                    '</tr>';
                                }
                            } else {
                                return '';
                            }
                        } ).join('');
     
                        return data ?
                            $('<table/>').append( data ) :
                            false;
                    }
                }
            },
            "pageLength": pageLength,
            "lengthChange": false,
            "bServerSide": false,
            "bProcessing": true,
            "data": sheetData,
            "aoColumns": columnObj,
            "aoColumnDefs": [
                { "width": "5%", "targets": 0 },
                { "width": "20%", "targets": 1 },
                { "width": "20%", "targets": 2 },
                { "width": "20%", "targets": 3 },
                { "width": "20%", "targets": 4 },
                {
                    className: 'control',
                    orderable: false,
                    targets:   0
                }
            ],
            "order": [[0, null]],
            "breakpoints": [
              {name: 'bigdesktop', width: Infinity},
              {name: 'meddesktop', width: 1480},
              {name: 'smalldesktop', width: 1280},
              {name: 'medium', width: 1188},
              {name: 'tabletl', width: 1024},
              {name: 'btwtabllandp', width: 848},
              {name: 'tabletp', width: 768},
              {name: 'mobilel', width: 480},
              {name: 'mobilep', width: 320}
            ],
            "fnCreatedRow": function( nRow, aData, iDataIndex ) {
                value = aData[columnObj[1].mDataProp].replace(/\s+/g,' ').trim();
                if ( $("#state-box option[value='" + value + "']").length == 0 ) {
                    $('<option/>').val(value).html(value).appendTo('#state-box');
                };
                dataArray = aData[columnObj[2].mDataProp].replace(/\s+/g,' ').trim().split(",");
                dataArray.forEach(function(entry) {
                    if ( $("#issue-box option[value='" + entry.trim() + "']").length == 0 ) {
                        $('<option/>').val(entry.trim()).html(entry.trim()).appendTo('#issue-box');
                    };
                });
            },
            "fixedHeader": {
                header: true
            }
    	});

        $('select#state-box').on( 'change', function (e) {
            if ($(this).find(":selected").text() === "All State") {
                table.column(1).search( "\\*\\", true, false).draw();
            } else {
                table.column(1).search( $(this).find(":selected").val()).draw();
            }
        });

        $('select#issue-box').on( 'change', function (e) {
            if ($(this).find(":selected").text() === "All Issues") {
                table.column(2).search("").draw();
            } else {
                table.column(2).search( $(this).find(":selected").val()).draw();
            }
        });

        for(var key of urlParams.keys()) {
            if (queryArray.includes(key)) {
                index = queryArray.indexOf(key);
                value = urlParams.get(key);

                table.column(index).search(value).draw();

                if (key === "state") {
                    $("#state-box option[value="+value+"]").attr('selected', 'selected');
                }
            }
        }

        $("#loader").hide();
        $("#full-container").show();
    })
});

$("#full-container").hide();
