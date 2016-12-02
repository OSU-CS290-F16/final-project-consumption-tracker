function displayNewHistory() //displays new history form
{
  var historyModal = document.getElementById('history-modal');
  historyModal.classList.remove('hidden');
}
function closeNewHistoryModal() // closes new history form
{
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

}
function displayEditHistoryModal()
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
