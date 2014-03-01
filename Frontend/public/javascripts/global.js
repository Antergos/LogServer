// Userlist data array for filling in info box
var logListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the log table on initial page load
  populateTable();

  // Log link click
  $('#logList table tbody').on('click', 'td a.linkshowlog', showLogInfo);

  // Delete Log link click
  $('#logList table tbody').on('click', 'td a.linkdeletelog', deleteLog);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/logs', function( data ) {

    // Stick our log data array into a loglist variable in the global object
    logListData = data;

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowlog" rel="' + this._id + '" title="Show Details">' + this.log_timestamp + '</td>';
      // tableContent += '<td><a href="#" class="linkdeletelog" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#logList table tbody').html(tableContent);
  });
};

// Show Log Info
function showLogInfo(event) {

  // Prevent Link from Firing
  event.preventDefault();

  // Retrieve id from link rel attribute
  var thisLogID = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = logListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisLogID);

  // Get our Log Object
  var thisLogObject = logListData[arrayPosition];

  //Populate Info Box
  $('#logOutput').html(thisLogObject.log_data.replace(/\r\n|\n|\r/gm, '<br />'));
};


// Delete Log
function deleteLog(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this log?');

  // Check and make sure the log confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/deletelog/' + $(this).attr('rel')
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      // Update the table
      populateTable();

    });

  }
  else {

    // If they said no to the confirm, do nothing
    return false;

  }

};