
var contentNode = document.getElementById('contents');

class ProductAvailable extends React.Component {
  render() {
    const productRows = this.props.products.map(product => <ProductRow key={product.id} product={product} />)
    return (
      <table>
       <thead>
         <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>{productRows}</tbody>
      </table>
    )
  }
}

class ProductRow extends React.Component {
  render() {
    const product = this.props.product;
    return (
      <tr>
       <td>{product.name}</td>
       <td>${product.price}</td>
       <td>{product.category}</td>
       <td><a href={product.image} target="_blank"> View</a></td>
     </tr>
    )
  }
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    var form = document.forms.productAdd;
    this.props.createProduct({
      id: form.id.value,
      name: form.productName.value,
      price: form.price.value,
      category: form.category.value,
      image: form.Image_URL.value
    });
    form.productName.value = ''
    form.price.value = ''
    form.Image_URL.value = ''
  }
  render() {
    return (
      <div>
      
      <form name="productAdd" onSubmit={this.onSubmit}>
      <div>
       <label>Category</label><br/>
       <select name="category" >
         <option value="Shirts">Shirts</option>
         <option value="Jeans">Jeans</option>
         <option value="Jackets">Jackets</option>
         <option value="Sweaters">Sweaters</option>
         <option value="Accessories">Accessories</option>
       </select>
       </div>
       <div>
       <label>Price Per Unit </label> <br/>
       <input type="text" name="price" placeholder="$"/>
       </div>
       <div>
       <label> Product Name</label><br/>
       <input type="text" name="productName"/>
       </div>
       <div>
       <label>Image URL</label><br/>
       <input type="text" name="Image_URL"  placeholder="URL"/>
       </div>
       <div>
       <button type="submit">Add Product</button>
       </div>
      </form>
      </div>
    )
  }
}

const products = [];

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: 
      []
     };
    this.createProduct = this.createProduct.bind(this);
  }
  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
      productList{
        id name price category image
      }
    }`;
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query })
      });
      const result = await response.json();
      this.setState({ products: result.data.productList });
     
    }

    async createProduct(product) {
      const query = `mutation addProduct($product: ProductInputs!) {
        addProduct(product: $product) {
          id
        }
      }`;
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables: { product }  })
    });
   if(response){this.loadData();}
   }

  render() {
    return (
      <div>
        <h1>My Company Inventory</h1>
        <h2>Showing all available products</h2>
        <hr/>
        <ProductAvailable products={this.state.products}/>
        <h2>Add a new product to inventory</h2>
        <hr/>
        <ProductAdd createProduct={this.createProduct}/>
      </div>
    );
  }
}
ReactDOM.render(<ProductList/>, contentNode);
