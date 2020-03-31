$(document).ready( function () {
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
        "pageLength": 15,
        "lengthChange": false,
        "bServerSide": false,
        "bProcessing": true,
        "sAjaxDataProp": "feed.entry",
        "sAjaxSource": "https://spreadsheets.google.com/feeds/list/19PBIps8-1k4jEjEv8iRH6DQp1IsVZlYCBwninqSxYNg/2/public/values?alt=json",
        "aoColumns": [
            {
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
            { "mDataProp": "gsx$state.$t" },
            { "mDataProp": "gsx$dateoforderannouncement.$t" },
            { "mDataProp": "gsx$issuescovered.$t" },
            { "mDataProp": "gsx$issuedbyannouncedby.$t" },
            { "mDataProp": "gsx$source.$t" },
            { "mDataProp": "gsx$foodincludingpds.$t" },
            { "mDataProp": "gsx$mdmicds-middaymealandanganwadis.$t" },
            { "mDataProp": "gsx$pensions.$t" },
            { "mDataProp": "gsx$incomesupportincludingnrega.$t" },
            { "mDataProp": "gsx$health.$t" },
            { "mDataProp": "gsx$medicine.$t" },
            { "mDataProp": "gsx$migrants.$t" },
            { "mDataProp": "gsx$workersemployee.$t" },
            { "mDataProp": "gsx$farmer.$t" },
            { "mDataProp": "gsx$undertrialsandprison.$t" },
            { "mDataProp": "gsx$otherrelief.$t" },
            { "mDataProp": "gsx$comments.$t" },
            { "mDataProp": "gsx$linktotheorder.$t" }
		],
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
            value = aData.gsx$state.$t.replace(/\s+/g,' ').trim();
            if ( $("#state-box option[value='" + value + "']").length == 0 ) {
                $('<option/>').val(value).html(value).appendTo('#state-box');
            };
            dataArray = aData.gsx$issuescovered.$t.replace(/\s+/g,' ').trim().split(",");
            dataArray.forEach(function(entry) {
                if ( $("#issue-box option[value='" + entry.trim() + "']").length == 0 ) {
                    $('<option/>').val(entry.trim()).html(entry.trim()).appendTo('#issue-box');
                };
            });
        },
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
            table.column(3).search("").draw();
        } else {
            table.column(3).search( $(this).find(":selected").val()).draw();
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const queryArray = ["", "state", "date", "issues", "issued_by", "source"]

    if (urlParams.get("state")) {
        table.column(1).search(urlParams.get("state")).draw();
    }

    for(var key of urlParams.keys()) {
        if (queryArray.includes(key)) {
            index = queryArray.indexOf(key);
            value = urlParams.get(key);

            table.column(index).search(value).draw();
        }
    }
});
