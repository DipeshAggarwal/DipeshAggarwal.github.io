function format ( d ) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>NS Code:</td>'+
            '<td>'+d.gsx$nscode.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>District:</td>'+
            '<td>'+d.gsx$district.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Name of Agency:</td>'+
            '<td>'+d.gsx$nameofagency.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Purpose:</td>'+
            '<td>'+d.gsx$purpose.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Address:</td>'+
            '<td>'+d.gsx$address.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Google Map:</td>'+
            '<td><a href="'+d.gsx$googlemapslink.$t+'">'+d.gsx$googlemapslink.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Capacity:</td>'+
            '<td>'+d.gsx$capacity.$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Area (Sq. Ft.):</td>'+
            '<td>'+d["gsx$areasq.ft."].$t+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Division:</td>'+
            '<td>'+d.gsx$division.$t+'</td>'+
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
		"sAjaxSource": "https://spreadsheets.google.com/feeds/list/1GLmmmwmjGu77BI1-LeY7A-Zoekvm2sKnO8XpWCDPF_w/1/public/values?alt=json",
		"aoColumns": [
			{
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
			{ "mDataProp": "gsx$district.$t" },
			{ "mDataProp": "gsx$nameofagency.$t" },
			{ "mDataProp": "gsx$purpose.$t" },
			{ "mDataProp": "gsx$type.$t" }
		]
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
});
