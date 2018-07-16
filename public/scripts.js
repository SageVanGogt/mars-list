$( document ).ready(function() {
  $( document ).ready(getItemData);

  const $itemSubmit = $('.item-submit');
  const $itemInput = $('.item-input');
  const $itemList = $('.item-list');

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
    const item = await response.json();
    prependItem(itemName, item.id, item.completed);
  }

  async function getItemData() {
    console.log('itemdata')
  }

  function prependItem(name, id, status) {
    $itemList.prepend(`
      <article class="item" id="${id}">
        <h3>${name}</h3>
        <button>delete</button>
        <input type="checkbox" checked="${status}">
      </article>
    `)
  }
})