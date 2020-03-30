function format ( d ) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>State:</td>'+
            '<td>'+d.gsx$state.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Source</td>'+
            '<td>'+d.gsx$source.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Date of Order:</td>'+
            '<td>'+d.gsx$dateoforderannouncement.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Issued By:</td>'+
            '<td>'+d.gsx$issuedbyannouncedby.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Food (including PDS):</td>'+
            '<td>'+d.gsx$foodincludingpds.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>MDM+ICDS:</td>'+
            '<td>'+d["gsx$mdmicds-middaymealandanganwadis"].$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Pensions:</td>'+
            '<td>'+d.gsx$pensions.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Income Support</td>'+
            '<td>'+d.gsx$incomesupportincludingnrega.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Health:</td>'+
            '<td>'+d.gsx$health.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Transport:</td>'+
            '<td>'+d.gsx$transport.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Migrants</td>'+
            '<td>'+d.gsx$migrants.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Worker/Employee Related:</td>'+
            '<td>'+d.gsx$workeremployeerelated.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Farmers:</td>'+
            '<td>'+d.gsx$farmers.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Undertrials and Prison:</td>'+
            '<td>'+d.gsx$undertrialsandprison.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Other Relief:</td>'+
            '<td>'+d.gsx$otherrelief.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Comments</td>'+
            '<td>'+d.gsx$comments.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Link to the Order:</td>'+
            '<td>'+d.gsx$linktotheorder.$t+'</td>'+
        '</tr>'+
    '</table>';
}

$(document).ready( function () {
    var table = $('#orderTable').DataTable({
		"autoWidth": false,
		"pageLength": 18,
		"lengthChange": false,
		"bServerSide": false,
		"bProcessing": true,
		"sAjaxDataProp": "feed.entry",
		"sAjaxSource": "https://spreadsheets.google.com/feeds/list/19PBIps8-1k4jEjEv8iRH6DQp1IsVZlYCBwninqSxYNg/2/public/values?alt=json",
		"aoColumns": [
			{
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
			{ "mDataProp": "gsx$state.$t" },
			{ "mDataProp": "gsx$source.$t" },
			{ "mDataProp": "gsx$dateoforderannouncement.$t" },
			{ "mDataProp": "gsx$issuedbyannouncedby.$t" }
		],
        "fnCreatedRow": function( nRow, aData, iDataIndex ) {
            value = aData.gsx$state.$t.replace(/\s+/g,' ').trim();
            if ( $("#state-box option[value='" + value + "']").length == 0 ) {
                $('<option/>').val(value).html(value).appendTo('#state-box');
            }
            //uniqueState.indexOf(aData.gsx$state.$t.replace(/\s+/g,' ').trim()) === -1 && uniqueState.push(aData.gsx$state.$t.replace(/\s+/g,' ').trim());
        }
	});

	// Add event listener for opening and closing details
    $('#orderTable tbody').on('click', 'td', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
    } );

    $('select').on( 'change', function (e) {
        console.log($(this).find(":selected").text());
        table.column(1).search( $(this).find(":selected").text() ).draw();
    } );
});
