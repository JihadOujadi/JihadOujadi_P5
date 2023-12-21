// récupération de l'ID produit dans l'URL
const paramsId = new URLSearchParams(location.search);

const idProduct = paramsId.get("id");

// fonction d'ajout d'éléments dans le DOM
function createNode(element) {
  return document.createElement(element);
}

function append(parent, el) {
  return parent.appendChild(el);
}

// appel de l'API pour récupération des infos produits depuis l'ID
const fetchIdProducts = async () => {
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

fetchIdProducts().then((product) => {
  displayInfoProduct(product);

  // action au clic du bouton
  const bouton = document.getElementById("addToCart");
  bouton.addEventListener("click", (e) => {
    const color = document.getElementById("colors");
    if (color.value == "") {
      alert("veuillez choisir une couleur SVP");
    }
    const quantity = document.getElementById("quantity");
    if (quantity.value < 1 || quantity.value > 100) {
      alert("veuillez choisir une quantité comprise entre 1 et 100 SVP");
    }
    if (
      (color.value == product.color && quantity.value > 1) ||
      quantity.value < 100
    )
    addToCart(product);
    confirmationAddToCart();
  });
});

const confirmationAddToCart = () => {
  const text =
    "Votre produit a bien été ajouté au panier\nSouhaitez-vous continuer vos achats ?";
  if (confirm(text)) {
    window.location.href = "index.html";
  } else {
    window.location.href = "cart.html";
  }
};

//ajout produit dans le localStorage
const addToCart = (product) => {
  const color = document.getElementById("colors");
  let quantity = document.getElementById("quantity");
  product.color = color.value;
  product.quantity = +quantity.value;

  let productCart = {
    id: idProduct,
    color: product.color,
    quantity: product.quantity
};
  let panier = JSON.parse(localStorage.getItem("panier"));
  if (panier) {
    let getProduct = panier.find(
      (p) => p.id == productCart.id && p.color == productCart.color
    );

    if (getProduct) {
      getProduct.quantity += product.quantity;
      localStorage.setItem("panier", JSON.stringify(panier));

      return;
    }
    panier.push(productCart);
      localStorage.setItem("panier", JSON.stringify(panier));
  } else {
    const cart = [productCart];
    localStorage.setItem("panier", JSON.stringify(cart));
  }
};

// ajout des informations produits dans le DOM
const displayInfoProduct = (product) => {
  const img = createNode("img");
  img.setAttribute("src", product.imageUrl);
  img.setAttribute("alt", product.altTxt);
  const divImage = document.querySelector("div.item__img");
  append(divImage, img);
  const titre = document.getElementById("title");
  titre.textContent = product.name;
  const prix = document.getElementById("price");
  prix.textContent = product.price;
  const descriptif = document.getElementById("description");
  descriptif.textContent = product.description;
  const colors = document.getElementById("colors");
  for (let color of product.colors) {
    const option = createNode("option");
    option.setAttribute("value", color);
    option.textContent = color;
    append(colors, option);
  }
};
