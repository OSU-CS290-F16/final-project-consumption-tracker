function displayModal()
{
  var historyModal = document.getElementById('add-tracker-modal');
  historyModal.classList.remove('hidden');
}
function closeModal()
{
  var historyModal = document.getElementById('modal');
  historyModal.classList.add('hidden');
  clearModalValue();
}
function clearModalValue()
{
  var modalInputs = document.getElementsByClassName('tracker-input-element');
  for (var i = 0; i < modalInputs.length; i++) {
    var input = modalInputs[i].querySelector('input, textarea');
    input.value = '';
  }
}
function insertNewItem()
{

}
function deleteItem()
{

}
