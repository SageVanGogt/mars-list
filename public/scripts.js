$( document ).ready(function() {
  $( document ).ready(getItemData);

  const $itemSubmit = $('.item-submit');
  const $itemInput = $('.item-input');
  const $itemList = $('.item-list');

  $itemSubmit.on('click', submitIdea);
  $itemList.on('click', '.delete-btn', deleteItem);
  $itemList.on('click', '.checkbox', patchPackItem);

  async function submitIdea(event) {
    event.preventDefault();
    const itemName = $itemInput.val();
    const response = await fetch('/api/v1/items', {
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
    const url = '/api/v1/items';
    const response = await fetch(url);
    const itemList = await response.json();
    addItemsToPage(itemList);
  }

  function addItemsToPage(items) {
    items.forEach(item => prependItem(item));
  }

  function prependItem(name, id, status) {
    $itemList.prepend(`
      <article class="item" id="${id}">
        <h3>${name}</h3>
        <button class="delete-btn">delete</button>
        <input 
          type="checkbox" 
          class="checkbox" 
          ${status && 'checkbox="checked"'}"
          value=${status}>
      </article>
    `)
  }

  async function deleteItem() {
    const itemId = parseInt(this.parentElement.id);
    const url = `/api/v1/items/${itemId}`;
    const body = { method: "DELETE" }
    const response = await fetch(url, body);
    $(`#${itemId}`).remove();
  }

  async function patchPackItem() {
    const itemId = parseInt(this.parentElement.id);
    const checkboxStatus = this.val();
    const url = `/api/v1/items/${itemId}`;

    const body = { 
      method: "PATCH",
      body: JSON.stringify({completed: !checkboxStatus})
    }
    const response = await fetch(url, body);
  }
})