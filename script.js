// This code runs after the DOM (document) has fully loaded.
document.addEventListener("DOMContentLoaded", function () {
    // Get references to HTML elements we'll be working with
    const dataList = document.getElementById("data-list"); // The list where data will be displayed
    const errorMessage = document.getElementById("error-message"); // Element to display error messages
    
    // Function to fetch data from an external API
    async function fetchData() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts");
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            const data = await response.json();
            displayData(data); // Display the retrieved data
        } catch (error) {
            handleErrorMessage(error); // Handle and display any errors that occur during the fetch
        }
    }
    // Function to create a new item on the server
    async function createItem(newItemData) {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newItemData),
        });

        if (!response.ok) {
            throw new Error("Failed to create a new item on the server.");
        }

        const createdItem = await response.json();

        // Push the newly created item to your local data array
        data.push(createdItem);

        // Display the updated data list with the new item
        displayData(data);
    } catch (error) {
        handleErrorMessage(error);
    }
}


    // Function to display data in the HTML
    function displayData(data) {
        dataList.innerHTML = ""; // Clear the existing data list
        data.forEach(item => {
            const listItem = createListItem(item); // Create a list item for each data item
            dataList.appendChild(listItem); // Append the list item to the data list

            // Add event listeners for the "Edit" and "Delete" buttons on each list item
            const editButton = listItem.querySelector(".edit-btn");
            const deleteButton = listItem.querySelector(".delete-btn");

            editButton.addEventListener("click", () => {
                editItem(item, listItem); // Handle the "Edit" button click
            });

            deleteButton.addEventListener("click", () => {
                deleteItem(item, listItem); // Handle the "Delete" button click
            });
        });
        
            // Add event listener for the "Add" button
        const addButton = document.getElementById("add-button");
        addButton.addEventListener("click", () => {
            const newTitle = prompt("Enter the title for the new item:");
            const newBody = prompt("Enter the body for the new item:");
            if (newTitle !== null && newBody !== null) {
                const newItem = {
                    title: newTitle,
                    body: newBody, 
                    // Add other properties as needed
                };
                createItem(newItem); // Create a new item on the server
            };
            data.push(newItem);
            displayData(data);
        });
        
    }
    

    function addItem() {
        const newTitle = prompt("Enter the title for the new item:");
        if (newTitle !== null) {
            const newItem = {
                title: newTitle,
                // Add other properties as needed
            };
            data.push(newItem); // Assuming "data" is your array of items

            // Display the updated data list
            displayData(data);
        }
    }
    async function editItem(item, listItem) {
        const newTitle = prompt("Edit the post title:", item.title);
        const newBody = prompt("Edit the post body:", item.body);
    
        if (newTitle !== null && newBody !== null) {
            try {
                const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${item.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: item.id,
                        title: newTitle,
                        body: newBody,
                        userId: 1, // Replace with the desired user ID
                    }),
                });
                if (!response.ok) {
                    throw new Error("Failed to update post.");
                }
                // Update the displayed title with the edited title
                const itemText = listItem.querySelector(".item-text");
                itemText.textContent = newTitle;
            } catch (error) {
                handleErrorMessage(error);
            }
        }
    }
    // Function to handle deleting an existing post
async function deleteItem(item, listItem) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${item.id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed to delete post.");
        }
        // Remove the deleted item from the HTML list
        dataList.removeChild(listItem);
    } catch (error) {
        handleErrorMessage(error);
    }
}

    // Function to create a list item element
    function createListItem(item) {
        const listItem = document.createElement("li"); // Create a new list item element
        listItem.innerHTML = `
            <span class="item-text">${item.title}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
        return listItem; // Return the created list item
    }

    // Function to handle and display error messages
    function handleErrorMessage(error) {
        errorMessage.textContent = `Error: ${error.message}`;
        errorMessage.classList.remove("hidden");
    }

    // Initial fetch of data when the page loads
    fetchData();
});


