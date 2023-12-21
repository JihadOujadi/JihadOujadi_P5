// Fonction pour la création des éléments dans le DOM
function createNode(element) {
  return document.createElement(element);
}

function append(parent, el) {
  return parent.appendChild(el);
}

// Appel de l'API et retour de la promesse
const fetchProducts = async () => {
  let products = [];
  const response = await fetch("http://localhost:3000/api/products");
  if (response.ok) {
    products = await response.json();
  } else {
    alert("Une erreur s'est produite, veuillez reéessayer plus tard");
  }
  console.log(products);
  return products;
};

// création des éléments du DOM
const displayProduct = async () => {
  const section = document.getElementById("items");
  const products = await fetchProducts();
  for (let product of products) {
    const a = createNode("a");
    a.setAttribute("href", `./product.html?id=${product._id}`);
    const article = createNode("article");
    const img = createNode("img");
    img.setAttribute("src", product.imageUrl);
    img.setAttribute("alt", product.altTxt);
    const h3 = createNode("h3");
    h3.classList.add("productName");
    h3.textContent = product.name;
    const p = createNode("p");
    p.classList.add("productDescription");
    p.textContent = product.description;
    append(article, img);
    append(article, h3);
    append(article, p);
    append(a, article);
    append(section, a);
  }
};
displayProduct();
