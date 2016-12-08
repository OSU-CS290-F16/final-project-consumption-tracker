function displayModal()
{
  console.log('dislayingModal');
  var modalBackground = document.getElementById('modal-backdrop');
  var historyModal = document.getElementById('add-tracker-modal');
  modalBackground.classList.remove('hidden');
  historyModal.classList.remove('hidden');
}
function closeModal()
{
  var modalBackground = document.getElementById('modal-backdrop');
  var historyModal = document.getElementById('add-tracker-modal');
  modalBackground.classList.add('hidden');
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
  console.log("Adding new item");
  var itemName = document.getElementById('tracker-input-name').value||'';
  var itemUnits = document.getElementById('tracker-input-unit').value||'';
  var itemAmount = document.getElementById('tracker-input-amount').value||'';

  var newItemTemplate =  Handlebars.templates['entry'];
  var newItemHtml = newItemTemplate({
    name: itemName,
    type: itemUnits,
    amount: itemAmount,
    unit: itemUnits
  });

  var mainElement = document.querySelector('main');
  mainElement.insertAdjacentHTML('beforeend', newItemHtml);
}
function deleteItem()
{

}
window.addEventListener('DOMContentLoaded', function (event) {

  var addItem = document.getElementById('add-item-button');
  if (addItem) {
    addItem.addEventListener('click', displayModal);
  }

  var modalCloseButton = document.querySelector('.modal-close-button');
  if (modalCloseButton) {
    modalCloseButton.addEventListener('click', closeModal);
  }

  var modalCancalButton = document.querySelector('.modal-cancel-button');
  if (modalCancalButton) {
    modalCancalButton.addEventListener('click', closeModal);
  }

  var addItemButton = document.querySelector('.modal-accept-button');
  if (addItemButton) {
    addItemButton.addEventListener('click', insertNewItem);
  }

});
