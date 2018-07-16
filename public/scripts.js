const $itemSubmit = $('.item-submit');
const $itemInput = $('.item-input');

$itemSubmit.on('click', submitIdea);

async function submitIdea(event) {
  event.preventDefault();
  const itemName = $itemInput.val();
  const response = await fetch('http://localhost:3000/api/v1/items', {
    method: 'POST',
    body: JSON.stringify({
      name: itemName,
      completed: false
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  const itemId = await response.json();
  prependItem(itemName, itemId);
}