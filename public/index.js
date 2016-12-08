function displayModal()
{
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

function insertNewTracker()
{
  var trackerName = document.getElementById('tracker-input-name').value || '';
  var trackerType = ''; // document.getElementById('tracker-input-type').value || ''; TODO: Form not implemented yet
  var trackerUnit = document.getElementById('tracker-input-unit').value || '';
  var trackerQuantity = document.getElementById('tracker-input-amount').value || '';

  if (trackerName.trim())
  {
    storeTracker(trackerName, trackerType, trackerUnit, trackerQuantity, function (err, trackerID) {
      if (err) {
        alert("Unable to save tracker. Error: " + err);
      } else {

        var trackerTemplate = Handlebars.templates.entry;
        var trackerHTML = trackerTemplate({
          name: trackerName,
          type: trackerType,
          unit: trackerUnit,
          quantity: trackerQuantity,
          id: trackerID
        });

        var main = document.querySelector('main');
        main.insertAdjacentHTML('beforeend', trackerHTML);

        closeModal();
      }
    });

  } else {
    alert('You must specify a name for the tracker.');
  }
}

function deleteTracker()
{
  console.log("Adding new item");
  var itemName = document.getElementById('tracker-input-name').value||'';
  var itemUnits = document.getElementById('tracker-input-unit').value||'';
  var itemAmount = document.getElementById('tracker-input-amount').value||'';

  var newItemTemplate =  Handlebars.templates.entry;
  var newItemHtml = newItemTemplate({
    name: itemName,
    type: itemUnits,
    amount: itemAmount,
    unit: itemUnits
  });

  var mainElement = document.querySelector('main');
  mainElement.insertAdjacentHTML('beforeend', newItemHtml);
}

function storeTracker(name, type, unit, quantity, callback)
{
  var postRequest = new XMLHttpRequest();
  postRequest.open('POST', '/');
  postRequest.setRequestHeader('Content-Type', 'application/json');

  postRequest.addEventListener('load', function (event) {
    var error;
    var trackerID = 0;

    if (event.target.status !== 200) {
      error = event.target.response;
    } else {
      // If there's no error, ID of new tracker will be in response
      trackerID = JSON.parse(event.target.response).trackerID;
    }
    callback(error, trackerID);
  });

  postRequest.send(JSON.stringify({
    name: name,
    type: type,
    unit: unit,
    quantity: quantity
  }));
}

window.addEventListener('DOMContentLoaded', function (event) {

  var addTracker = document.getElementById('add-item-button');
  if (addTracker) {
    addTracker.addEventListener('click', displayModal);
  }

  var modalCloseButton = document.querySelector('.modal-close-button');
  if (modalCloseButton) {
    modalCloseButton.addEventListener('click', closeModal);
  }

  var modalCancelButton = document.querySelector('.modal-cancel-button');
  if (modalCancelButton) {
    modalCancelButton.addEventListener('click', closeModal);
  }

  var addTrackerButton = document.querySelector('.modal-accept-button');
  if (addTrackerButton) {
    addTrackerButton.addEventListener('click', insertNewTracker);
  }

});
