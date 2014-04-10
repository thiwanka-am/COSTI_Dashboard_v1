
function changeSubArea(){
	$('#rightDiv').hide();
	$('#grid').show();
	loadGrid();
}

function load(){
	$('#grid').hide();
}

function loadGrid() {

	oTable = $('#peopleGrid').dataTable({
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"iDisplayLength": 5,
		"bLengthChange" :true,
		"aaSorting": [[ 0, "asc" ]],
		"aLengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
		"aaData": [
		/* Reduced data set */
		[ ' P Abdul Salam ','University of Colombo' , 65  , 0 ] ,
		[ ' Abeysena C  ' ,'University of Colombo' , 27  , 0 ] ,
		[ ' Arulampalam A ' , 'University of Colombo' ,78  , 0 ] ,
		[ ' Balasuriya A  ' ,'University of Colombo' , 124  , 0 ] ,
		[ ' Herath C  ' , 'University of Colombo' ,45  , 0 ] ,
		[ ' Lareef Zubair ' , 'University of Colombo' ,78  , 0 ] ,
		[ ' Lautze J  ' ,'University of Colombo' , 56  , 0 ] ,
		[ ' Maithripala D ' ,'University of Colombo' , 89  , 0 ] ,
		[ ' Manderson L ' , 'University of Colombo' ,32  , 0 ] ,
		[ ' Merrey D  ' , 'University of Colombo' ,58  , 0 ] ,
		[ ' Michael Abramson  ' ,'University of Colombo' , 74  , 0 ] ,
		[ ' Mowjood M ' ,'University of Colombo' , 49  , 0 ] ,
		[ ' Noojipady P ' ,'University of Colombo' , 27  , 0 ] ,
		[ ' P G McCornick ' ,'University of Colombo' , 36  , 0 ] ,
		[ ' Suneth Agampodi ' ,'University of Colombo' , 21  , 0 ] 
		],
		"aoColumns": [
		{ "sTitle": "Researcher Name" ,"sWidth": "36%"},
		{ "sTitle": "Institute","sWidth": "36%" },
		{ "sTitle": "# Papers","sWidth": "14%" },
		{ "sTitle": "# Patents","sWidth": "15%" }
		]
	});

/* Add a click handler to the rows - this could be used as a callback */
$("#peopleGrid tbody").click(function(event) {
	$(oTable.fnSettings().aoData).each(function (){
		$(this.nTr).removeClass('row_selected');
	});
	$(event.target.parentNode).addClass('row_selected');
});
}