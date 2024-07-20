const $createForm = document.querySelector('#createForm');
const $updateForm = document.querySelector('#updateForm');
const $result = document.querySelector('#result');
const $inputs = $createForm.querySelectorAll('.formInput');
const $updateInputs = $updateForm.querySelectorAll('.formInput');

function loadingData() {
    fetch("https://6662ac4162966e20ef097175.mockapi.io/api/products/products")
        .then(response => response.json())
        .then(data => renderData(data));
}

loadingData();

function renderData(products) {
    $result.innerHTML = '';
    products.forEach(product => {
        const $div = document.createElement("div");
        $div.className = "card";
        $div.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="info">
                <h3>${product.title.slice(0, 13)}...</h3>
                <p>${product.description.slice(0, 30)}...</p>
                <p class="price">Price: $${product.price}</p>
                <p class="discount">Discount: $${product.discount}</p>
                <button class="updateBtn" data-id="${product.id}">Update</button>
                <button class="deleteBtn" data-id="${product.id}">Delete</button>
            </div>
        `;
        $result.appendChild($div);
    });
}

const handleCreateNewProduct = (e) => {
    e.preventDefault();

    const values = Array.from($inputs).map(input => input.value);
    let product = {
        title: values[0],
        price: parseFloat(values[1]),
        description: values[2],
        discount: parseFloat(values[3]),
        image: values[4],
    };
    
    fetch("https://6662ac4162966e20ef097175.mockapi.io/api/products/products", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(product),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        window.location.reload();
    });
};

const handleUpdateProduct = (e) => {
    e.preventDefault();
    const id = $updateForm.getAttribute("data-current-update-product-id");
    const values = Array.from($updateInputs).map(input => input.value);
    let product = {
        title: values[0],
        price: parseFloat(values[1]),
        description: values[2],
        discount: parseFloat(values[3]),
        image: values[4],
    };
    fetch(`https://6662ac4162966e20ef097175.mockapi.io/api/products/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        lwindow.location.reload();
    });
};

const handleFillUpdateForm = (e) => {
    if (e.target.classList.contains('updateBtn')) {
        const id = e.target.dataset.id;
        fetch(`https://6662ac4162966e20ef097175.mockapi.io/api/products/products/${id}`)
        .then(response => response.json())
        .then(data => {
            $updateInputs[0].value = data.title;
            $updateInputs[1].value = data.price;
            $updateInputs[2].value = data.description;
            $updateInputs[3].value = data.discount;
            $updateInputs[4].value = data.image;
            $updateForm.setAttribute("data-current-update-product-id", id);
        });
    } else if (e.target.classList.contains('deleteBtn')) {
        const id = e.target.dataset.id;
        fetch(`https://6662ac4162966e20ef097175.mockapi.io/api/products/products/${id}`, {
            method: "DELETE",
        })
        .then(response => response.json())
        .then(data => {
            window.location.reload();
        });
    }
};

$createForm.addEventListener('submit', handleCreateNewProduct);
$updateForm.addEventListener('submit', handleUpdateProduct);
$result.addEventListener('click', handleFillUpdateForm);
