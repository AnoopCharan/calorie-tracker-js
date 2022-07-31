// storage controller

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
        }
    }
})();


// UI controller
const UICtrl = (function(){
    const UISelectors ={
        itemList: '#item-list',
        addBtn : '.add-btn',
        itemNameInput: '#item-name',
        itemCalInput: '#item-calories',
        totalCalories: '.total-calories'
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

        clearInput: () => {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCalInput).value = '';
        }

    }

    

})();


// app controller
const App = (function(){
    //load event listners
    const loadEventListeners =  () => {
        // get ui selectors from UI controller
        const UISelectors = UICtrl.getSelectors();

        // add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

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
            
            // clear fields
            UICtrl.clearInput();
        } 
        e.preventDefault();}

    // returning objects are public
    return {
        init: function() {

            
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
            
        }
    }
})(ItemCtrl, UICtrl);

// Initialize app 

App.init();