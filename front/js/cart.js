let currentUrl = document.location.href;

let productsOrder = JSON.parse(localStorage.getItem("panier"));
// création des éléments du DOM
if (/cart.html/.test(currentUrl)) {
  // fonction d'ajout d'éléments dans le DOM
  function createNode(element) {
    return document.createElement(element);
  }

  function append(parent, el) {
    return parent.appendChild(el);
  }

  // appel de l'API pour récupération des infos produits depuis l'ID
const fetchIdProducts = async (idProduct) => {
  let idInfoProducts = [];
  const response = await fetch(
    `http://localhost:3000/api/products/${idProduct}`
  );
  if (response.ok) {
    idInfoProducts = await response.json();
  } else {
    alert("Une erreur s'est produite, veuillez reéessayer plus tard");
  }
  return idInfoProducts;
};

// affichage du montant total selon la quantité et de la quantité totale

const displayTotalCart = () => {
  const totalQuantity = document.getElementById("totalQuantity");
  const totalPrice = document.getElementById("totalPrice");
  const section = document.getElementById("cart__items");
  const carts = document.querySelectorAll('.cart__item');

  let totalPriceCart = 0;
  let totalQuantityCart = 0;
  carts.forEach((cart) =>{
    console.log(cart);
    const price = +cart.dataset.price;
    const quantity = +cart.dataset.quantity;
    totalPriceCart += quantity * price;
    totalQuantityCart += quantity;
  })
  totalPrice.textContent = totalPriceCart;
  totalQuantity.textContent = totalQuantityCart;
  console.log(carts);  

  if (productsOrder == 0) {
    const divCartEmpty = createNode("div");
    const textCartEmpty = createNode("h3");
    textCartEmpty.textContent = "Votre panier est vide";
    textCartEmpty.style.marginbottom = "50px";
    textCartEmpty.style.textalign = "center";
    append(divCartEmpty, textCartEmpty);
    append(section, divCartEmpty);
    
  }
};

  // ajout des informations produits dans le DOM
  const displayProduct = async () => {
    const section = document.getElementById("cart__items");
    
    for (let product of productsOrder) {
      const productApi = await fetchIdProducts(product.id);
      const article = createNode("article");
      article.classList.add("cart__item");
      article.setAttribute("data-id", `${product.id}`);
      article.setAttribute("data-price", `${productApi.price}`);
      article.setAttribute("data-quantity", `${product.quantity}`);
      article.setAttribute("data-color", `${product.color}`);
      const divImg = createNode("div");
      divImg.classList.add("cart__item__img");
      const img = createNode("img");
      img.setAttribute("src", productApi.imageUrl);
      img.setAttribute("alt", productApi.altTxt);
      const divContent = createNode("div");
      divContent.classList.add("cart__item__content");
      const divDescription = createNode("div");
      divDescription.classList.add("cart__item__content__description");
      const h2 = createNode("h2");
      h2.textContent = productApi.name;
      const pColor = createNode("p");
      pColor.textContent = product.color;
      const pPrice = createNode("p");
      pPrice.textContent = productApi.price + "€";
      const divSettings = createNode("div");
      divSettings.classList.add("cart__item__content__settings");
      const divQuantity = createNode("div");
      divQuantity.classList.add("cart__item__content__settings__quantity");
      const pQuantity = createNode("p");
      pQuantity.textContent = "Qté : ";
      const input = createNode("input");
      input.setAttribute("type", "number");
      input.classList.add("itemQuantity");
      input.setAttribute("name", "itemQuantity");
      input.setAttribute("min", "1");
      input.setAttribute("max", "100");
      input.setAttribute("value", `${product.quantity}`);
      input.addEventListener("change", (e) => updateProduct(e));
      const divDelete = createNode("div");
      divDelete.classList.add("cart__item__content__settings__delete");
      const pDelete = createNode("p");
      pDelete.classList.add("deleteItem");
      pDelete.textContent = "Supprimer";
      pDelete.addEventListener("click", (e) => deleteProduct(e));
      append(article, divImg);
      append(divImg, img);
      append(article, divContent);
      append(divContent, divDescription);
      append(divDescription, h2);
      append(divDescription, pColor);
      append(divDescription, pPrice);
      append(article, divSettings);
      append(divSettings, divQuantity);
      append(divQuantity, pQuantity);
      append(divQuantity, input);
      append(divDelete, pDelete);
      append(article, divDelete);
      append(section, article);
    }
  };
  displayProduct();
  setTimeout(() => {
    displayTotalCart();
  },1000);

  
  

  // action au clic du bouton pour mettre à jour la quantité
  const updateProduct = (e) => {
    const article = e.target.closest("article");
    const productId = article.getAttribute("data-id");
    const productColor = article.getAttribute("data-color");

    let quantity = document.getElementById("quantity");

    if (productsOrder) {
      let getProduct = productsOrder.find(
        (p) => p.id == productId && p.color == productColor
      );

      if (+e.target.value < 1 || +e.target.value > 100) {
        alert("veuillez choisir une quantité comprise entre 1 et 100 SVP");
        location.reload();
      }else{
        getProduct.quantity = +e.target.value;
        getProduct += productsOrder.quantity;
        localStorage.setItem("panier", JSON.stringify(productsOrder));
        location.reload();
      }
      

      displayTotalCart();
    }
    
  };

  // action au clic du bouton pour supprimer un élément dans le panier
  const deleteProduct = (e) => {
    const article = e.target.closest("article");
    const productId = article.getAttribute("data-id");
    const productColor = article.getAttribute("data-color");

    if (productsOrder) {
      let getProduct = productsOrder.find(
        (p) => p._id == productId && p.color == productColor
      );
      console.log(productsOrder);
      productsOrder.splice(productsOrder.indexOf(getProduct), 1);
      localStorage.setItem("panier", JSON.stringify(productsOrder));
      console.log(productsOrder);
      location.reload();
      displayTotalCart();
    }
  };

  // initialisation des valeurs pour la vérification des infos saisies
  let form = document.querySelector(".cart__order__form");
  validForm = false;

  const inputFirstName = document.getElementById("firstName");
  const inputLastName = document.getElementById("lastName");
  const inputAddress = document.getElementById("address");
  const inputCity = document.getElementById("city");
  const InputEmail = document.getElementById("email");
  const orderId = document.getElementById("order");

  // Vérification des données saisies par l'utilisateur

  // vérification du prénom
  inputFirstName.addEventListener("change", (e) => {
    let firstName = e.target.value;
    if (firstName.length == 0) {
      firstNameErrorMsg.textContent = "Le champ de saisie est vide";
      validForm = false;
    } else if (!/^[a-zA-Z\- ]+$/.test(firstName)) {
      firstNameErrorMsg.textContent =
        "Le champ ne doit contenir que des lettres";
      validForm = false;
    } else {
      firstNameErrorMsg.textContent = "";
      validForm = true;
    }
    console.log(validForm);
  });

  // vérification du nom
  inputLastName.addEventListener("change", (e) => {
    let lastName = e.target.value;
    if (lastName.length == 0) {
      lastNameErrorMsg.textContent = "Le champ de saisie est vide";
      validForm = false;
    } else if (!/^[a-zA-Z\- ]+$/.test(lastName)) {
      lastNameErrorMsg.textContent =
        "Le champ ne doit contenir que des lettres";
      validForm = false;
    } else {
      lastNameErrorMsg.textContent = "";
      validForm = true;
    }
    console.log(validForm);
  });

  // vérification de l'adresse
  inputAddress.addEventListener("change", (e) => {
    let address = e.target.value;
    if (address.length == 0) {
      addressErrorMsg.textContent = "Votre adresse n'est pas renseignée";
      validForm = false;
    } else if (!/^[0-9]*?[a-zA-ZÀ-ÿ0-9, \-]*?$/.test(address)) {
      addressErrorMsg.textContent =
        "Votre adresse ne doit pas contenir de caractères spéciaux";
      validForm = false;
    } else {
      addressErrorMsg.textContent = "";
      validForm = true;
    }
    console.log(validForm);
  });

  // vérification de la ville
  inputCity.addEventListener("change", (e) => {
    let city = e.target.value;
    if (city.length == 0) {
      cityErrorMsg.textContent = "Votre ville n'est pas renseignée";
      validForm = false;
    } else if (!/^[A-zÀ-ÿ' \-]+\S$/u.test(city)) {
      cityErrorMsg.textContent =
        "Votre code postal ne doit pas contenir de chiffres";
      validForm = false;
    } else {
      cityErrorMsg.textContent = "";
      validForm = true;
    }
    console.log(validForm);
  });

  // vérification de l'adresse mail
  InputEmail.addEventListener("change", (e) => {
    let email = e.target.value;
    if (email.length == 0) {
      emailErrorMsg.textContent = "Le champ de saisie est vide";
      validForm = false;
    } else if (
      !/^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,3}$/g.test(email)
    ) {
      emailErrorMsg.textContent = "Adresse email invalide";
      validForm = false;
    } else {
      emailErrorMsg.textContent = "";
      validForm = true;
    }
  });

  // récupération des données utilisateurs et du panier et envoie à l'API
  // puis affichage du numéro de commande dans la page Confirmation
  orderId.addEventListener("click", (e) => {
    event.preventDefault();
    let productsId = [];
    for (let productId of productsOrder) {
      productsId.push(productId.id);
    }

    let request = {
      contact: {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
      },
      products: productsId,
    };

    if (validForm) {
      fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })
        .then((data) => {
          return data.json();
        })
        .then((request) => {
          window.location.href = `confirmation.html?id=${request.orderId}`;
        })
        .catch((error) => {
          alert("Une erreur s'est produite, veuillez reéessayer plus tard");
        });
    } else {
      alert("certains champs sont vides");
    }
  });
} else if (/confirmation.html/.test(currentUrl) === true) {
  const paramsId = new URL(currentUrl);
  const idOrderProduct = paramsId.searchParams.get("id");
  console.log(idOrderProduct);

  let orderProduct = document.getElementById("orderId");
  orderProduct.textContent = idOrderProduct;
  productsOrder.splice(0);
  localStorage.setItem("panier", JSON.stringify(productsOrder));
}
