function displayNewHistory() //displays new history form
{
  var historybackground = document.getElementById('modal-history-backdrop');
  historybackground.classList.remove('hidden');
  var historyModal = document.getElementById('history-modal');
  historyModal.classList.remove('hidden');
}

function closeNewHistoryModal() // closes new history form
{
  var historybackground = document.getElementById('modal-history-backdrop');
  historybackground.classList.add('hidden');
  var historyModal = document.getElementById('history-modal');
  historyModal.classList.add('hidden');
  clearNewHistoryModalValues();
}

function clearNewHistoryModalValues() // clears history forms values
{
  var historyFields = document.getElementsByClassName('history-input-element');
  for (var i = 0; i < historyFields.length; i++) {
    var input = historyFields[i].querySelector('input, textarea');
    input.value = '';
  }
}

function addNewHistory()
{
  var historyAmount = document.getElementById('history-input-amount').value||'';
  var historyDate = document.getElementById('history-input-date').value||'';

  // Quantity is required
  if (historyAmount.trim())
  {
    storeHistory(historyDate, historyAmount, function (err, date, unit) {
      if (err) {
        alert("Unable to save history. " + err);
      } else {

        var historyTemplate =  Handlebars.templates.itemHistory;
        var historyHtml = historyTemplate({
          date: date,
          quantity: historyAmount,
          unit: unit
        });

        var sectionElement = document.querySelector('section');
        sectionElement.insertAdjacentHTML('beforeend', historyHtml);

        closeModal();
      }
    });

  } else {
      alert('You must specify the quantity consumed or gained.');
  }
}

function storeHistory(date, quantity, callback)
{
  var postRequest = new XMLHttpRequest();
  postRequest.open('POST', window.location.pathname); // Current path
  postRequest.setRequestHeader('Content-Type', 'application/json');

  postRequest.addEventListener('load', function (event) {
    var err;
    var date;
    var unit;

    if (event.target.status !== 200) {
      err = event.target.response;
    } else {
      var response = JSON.parse(event.target.response);
      date = response.date;
      unit = response.unit;
    }

    callback(err, date, unit);
  });

  postRequest.send(JSON.stringify({
    date: date,
    quantity: quantity
  }));
}

// NO MODAL YET
/*function displayEditHistoryModal()
{
  var editHistoryModal = document.getElementById('edit-history-modal');
  historyModal.classList.remove('hidden');
}
function closeEditHistoryModal()
{
  var editHistoryModal = document.getElementById('edit-history-modal');
  historyModal.classList.add('hidden');
  clearEditHistory();
}
function clearEditHistory()
{
  var editHistoryFields = document.getElementsByClassName('edit-history-input-element');
  for (var i = 0; i < editHistoryFields.length; i++) {
    var input = editHistoryFields[i].querySelector('input, textarea');
    input.value = '';
  }
}
function changeHistoryItem()
{

}
*/
window.addEventListener('DOMContentLoaded', function (event) {

  var addhistory = document.getElementById('add-history-button');
  if (addhistory) {
    addhistory.addEventListener('click', displayNewHistory);
  }

  var historyCloseButton = document.querySelector('.modal-close-button-history');
  if (historyCloseButton) {
    historyCloseButton.addEventListener('click', closeNewHistoryModal);
  }

  var historyCancalButton = document.querySelector('.modal-cancel-button-history');
  if (historyCancalButton) {
    historyCancalButton.addEventListener('click', closeNewHistoryModal);
  }

  var addhistoryButton = document.querySelector('.modal-accept-button-history');
  if (addhistoryButton) {
    addhistoryButton.addEventListener('click', addNewHistory);
  }

});
