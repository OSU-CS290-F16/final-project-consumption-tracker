function displayNewHistory() //displays new history form
{
  var historybackground = document.getElementById('modal-history-backdrop')
  historybackground.classList.remove('hidden');
  var historyModal = document.getElementById('history-modal');
  historyModal.classList.remove('hidden');
}
function closeNewHistoryModal() // closes new history form
{
  var historybackground = document.getElementById('modal-history-backdrop')
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
  console.log("Adding new history");
  var historyAmount = document.getElementById('history-input-amount').value||'';
  var historyDate = document.getElementById('history-input-date').value||'';

  var newHistoryTemplate =  Handlebars.templates['history'];
  console.log(newHistoryTemplate);
  var newHistoryHtml = newHistoryTemplate({
    date: historyDate,
    consumption: historyAmount
  });

  var mainElement = document.querySelector('main');
  mainElement.insertAdjacentHTML('beforeend', newHistoryHtml);
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
