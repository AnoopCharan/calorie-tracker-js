// storage controller
// const StorageCtrl = (function(){
//     // public methods
//     return {
//         storeItems: (item) => {
//             let items=[];
//             // check if any items in local storage
//             if(localStorage.getItem('items') === null) {
//                 items=[];
//                 // push new items
//                 items.push(item);
//                 // set value in localstore
//                 localStorage.setItem('items', JSON.stringify(items));
//             } else {
//                 items = JSON.parse(localStorage.getItem('items'));
//                 // push new items
//                 items.push(item);
//                 // set value in localstore
//                 localStorage.setItem('items', JSON.stringify(items));

//             }
//         }
//     }
// })();

// item controller
// module pattern
const ItemCtrl = (function(){
    // private
    // item contructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories=calories;
    }

    // data structure/state
    const data = {
        items: [
            // {id:0, name:'steak dinner', calories:1200},
            // {id:1, name:'fries', calories:600},
            // {id:2, name:'rice', calories:700},
        ],
        currentItem: null,
        totalCalories: 0
    };
    
    //public vars sand functions to access private vars and data
    return {
        logData: function(){
            return data;
        },
        getItems: function() {
            return data.items;
        },

        getItemById: (id) => {
            let found= null;
            // search for item
            data.items.forEach((item) => {
                if (item.id === id) {
                    found = item; 
                }
            })

            return found;
        },
        updateItem: (name, calories) => {
            // turn calories to number
            calories = parseInt(calories);
            let found= null;
            // search for item
            data.items.forEach((item) => {
                if (item.id === data.currentItem.id) {
                    item.name= name;
                    item.calories= calories; 
                    found = item;
                }
            })

            return found;

        },

        deleteItem: (id) => {
            // get ids
            ids = data.items.map((item) => {
                return item.id;
            });

            // get index
            const index = ids.indexOf(id);

            // remove item
            data.items.splice(index, 1);
        },

        clearAllItems: () => {
            data.items=[];
            // data.totalCalories=0;
        },

        getTotalCalories: () => {
            let total =0;
            data.items.forEach((item) => {
                total += item.calories;
            })
            data.totalCalories = total;

            return data.totalCalories;
        },

        addItem: (name, calories) => {
            let ID;
            // create id
            if(data.items.length > 0) {
                ID=data.items[data.items.length - 1].id + 1;
            } else {
                ID=0;
            }
            
            // calories to number
            calories = parseInt(calories);

            // create new Item
            let newItem = new Item(ID, name, calories);
            data.items.push(newItem);

            return newItem;
        },

        setCurrentItem: (item) => {data.currentItem = item},

        getCurrentItem : () => data.currentItem
    }
})();


// UI controller
const UICtrl = (function(){
    const UISelectors ={
        itemList: '#item-list',
        addBtn : '.add-btn',
        itemNameInput: '#item-name',
        itemCalInput: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn:'.update-btn',
        deleteBtn:'.delete-btn',
        backBtn:'.back-btn',
        listItems:'#item-list li',
        clearBtn: '.clear-btn'

    };
    return {

        hideList: () =>{
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotal: (total) => {
            document.querySelector(UISelectors.totalCalories).innerHTML = total;
        },
        populateItems: function(items) {
            let html ='';

            items.forEach(function(item){
                html+= `<li class="collection-item" id="item-${item.id}">
                            <strong>${item.name}: </strong> <em>${item.calories}</em>
                            <a href="" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>
                        </li> `;
            });

            // send html into place
            document.querySelector(UISelectors.itemList).innerHTML = html;
            },

            getSelectors: () => UISelectors,

            getItemInput: () => {
                return {
                    name: document.querySelector(UISelectors.itemNameInput).value,
                    calories: document.querySelector(UISelectors.itemCalInput).value 
                }
        },



        addListItem: (item) => {
            // display list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // create list element
            const li = document.createElement('li');
            // add classes to list elemnmnent
            li.className ='collection-item';
            // add ID
            li.id= `item-${item.id}`;



            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories}</em>
                            <a href="" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>`;

            // send html into place
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

        },

        updateListItem: (item) => {
            // get node list
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach((listItem) => {
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories}</em>
                    <a href="" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                    `
                }
            })
        },

        deleteListItem: (id) =>{
            const itemID =`#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        clearListItems: () => {
            let listItems= document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            listItems.forEach((item) => item.remove());
        },

        
        addItemToForm: () => {

            let currentItem = ItemCtrl.getCurrentItem();
            console.log(currentItem);
            document.querySelector(UISelectors.itemNameInput).value = currentItem.name;
            document.querySelector(UISelectors.itemCalInput).value =currentItem.calories;
            UICtrl.showEditState();
        },

        clearInput: () => {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCalInput).value = '';
        },

        clearEditState: () => {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';

        },

        
        showEditState: () => {

            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';

        }

    }

    

})();


// app controller
const App = (function(ItemCtrl, UICtrl){
    //load event listners
    const loadEventListeners =  () => {
        // get ui selectors from UI controller
        const UISelectors = UICtrl.getSelectors();

        // add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // disablesubmit on enter
        document.addEventListener('keypress', (e) => {
            if(e.code === 'Enter'){
                e.preventDefault();
                return false;
            }
        })

        // edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Item edit
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', (e) => {
            UICtrl.clearEditState();
            e.preventDefault();
        });

        // delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // clear all event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', itemClearAllClick);

    }

    // Add item submit
    const itemAddSubmit = (e) => {
        // get form input from UI controller
        const input = UICtrl.getItemInput();
        
        // check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // add item to ui list
            UICtrl.addListItem(newItem);
            // add to total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // add total calories to UI
            UICtrl.showTotal(totalCalories);

            // // store in local storage
            // StorageCtrl.storeItem(newItem);
            
            // clear fields
            UICtrl.clearInput();
        } 
        e.preventDefault();}

    // update item edit click

    const itemEditClick = (e) => {
        if (e.target.classList.contains('edit-item')) {
            // get list item ID
            const listID =e.target.parentNode.parentNode.id;

            // break string to array
            const listIdAr = listID.split('-');

            // data id
            const id = parseInt(listIdAr[1]);

            // get id
            const itemToEdit =ItemCtrl.getItemById(id);

            
            // set to current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // add item to form
            UICtrl.addItemToForm();

        }
        e.preventDefault();}

    // Item Update submit

    const itemUpdateSubmit = (e) => {
        // get item input
        const input = UICtrl.getItemInput();

        // update item
        const updateItem = ItemCtrl.updateItem(input.name, input.calories);

        // update UI
        UICtrl.updateListItem(updateItem);

        // add to total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total calories to UI
        UICtrl.showTotal(totalCalories);

        UICtrl.clearEditState();

        e.preventDefault();}

    // item delte submit
    const itemDeleteSubmit = (e) => {
        // get  current item
        const currentItem = ItemCtrl.getCurrentItem();

        // delete from data 
        ItemCtrl.deleteItem(currentItem.id);

        // remove from UI
        UICtrl.deleteListItem(currentItem.id);

        // add to total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total calories to UI
        UICtrl.showTotal(totalCalories);

        UICtrl.clearEditState();

    }

    // clear all items 
    const itemClearAllClick = () => {
        // delete all items in data
        ItemCtrl.clearAllItems();
        // add to total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total calories to UI
        UICtrl.showTotal(totalCalories);

        // remove items from list
        UICtrl.clearListItems();

        UICtrl.hideList();
    }

    // returning objects are public
    return {
        init: function() {
            // clear edit state /set intial state
            UICtrl.clearEditState();

            
            // load event listners
            loadEventListeners();
            
            // fetch items from data structure  
            const items = ItemCtrl.getItems();
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                // populate list with items
                UICtrl.populateItems(items);

            }
            const totalCalories = ItemCtrl.getTotalCalories();
            // add total calories to UI
            UICtrl.showTotal(totalCalories);
            
        }
    }
})(ItemCtrl, UICtrl);

// Initialize app 

App.init();