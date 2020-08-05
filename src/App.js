import React, { Component } from 'react';
import './App.css';
import MenuCard from './components/MenuCard';
import OrderCart from './components/OrderCart';
import OrderTypeSelector from './components/OrderTypeSelector';
import { Router, Link, Route} from 'react-router-dom';
import axios from 'axios';
import AddItem from './components/AddItem'; 
import EditItem from './components/EditItem'; 
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';



class App extends Component {
  categories = [];

  items = [];

  state = {
    total: 0,
    orders: [],
    showCards: [...this.items],
    items: [],
    editItem: null,
    loginUser: JSON.parse(localStorage.getItem('userData')),
    errorMessage: '',
    // logoutUser: '',
  };

  // ...req.body

  componentDidMount() {
    //non-blocking, async, return a promise
    // fetch('http://localhost:8080/items')
    //.then resolves a promis
    // .then(res => res.json())
    // .then(res => {
    //   return res.json()
    // })
    // .then(data => {
    //   this.items = data;
    //   this.setState({
    //     showCards: data,
    //     items: data
    //   })
    // })
    axios('http://localhost:8080/items')
    .then(res => {
      this.items = res.data;
      let items = res.data;
      this.setState({
        showCards: items,
        items: items
      })
    });

    axios('http://localhost:8080/categories')
    .then(res => {
      this.categories = res.data;
      let categories = res.data;
      this.setState({
        categories: categories
      })
    });


  }

  addItem = newItem => {
    this.setState({
      showCards: [this.state.showCards, newItem]
    })
    axios.put('http://localhost:8080/items/' + this.props.id)
  }

  checkout = () => {
      axios.post('http://localhost:8080/orders', {
        total: this.state.total,
       orders: this.state.orders
      })
  }
    //   .then(res => {
    //     // console.table(res.data);
    //     alert('order successful');
    //     this.setState({
    //       oders: []
    //     })
    //   })
    // }

  orderClicked = (orderGiven) => {
    const newOrder = {
      ...orderGiven,
    };

    const orderIndex = this.state.orders.findIndex((order) => {
      return order.id === newOrder.id;
    });

    let orders = [...this.state.orders];
    let newTotal = this.state.total + newOrder.price;

    if (orderIndex > -1) {
      orders[orderIndex].qty += 1
      let subTotal = newOrder.price * orders[orderIndex].qty;
      orders[orderIndex].subTotal = subTotal;
    } else {
      newOrder.qty = 1;
      let subTotal = newOrder.price * newOrder.qty;
      newOrder.subTotal = subTotal;
      orders = [...this.state.orders, newOrder];
    }

    this.setState({
      total: newTotal,
      orders: orders,
    });
  };

  editItem = (edited) => {
    this.setState({
      editItem: edited,
    })
  } 

  loginFn = (user) => {
    this.setState({
      loginUser: user 
    })
  }

  logoutFn = () => {
    localStorage.removeItem('userData')
    this.setState({
      loginUser: null   
    })
  }

  errorMessageFn = () => {
    this.setState({
      errorMessage: "Login failed. Try again!"
    })
  }

  updatedItem = (edited) => {
    let newItem = this.state.showCards.map((item) => {
      if( item._id== this.state.editItem._id) {
        console.log(item, this.state.editItem);
        return edited;
      }
      else {
        return item;
      }
    })
    this.setState({
      editItem: null,
      showCards: newItem
    })
  }

  //a subtotal function
  //pricexquantity
  //dont chnage the value.price

  changeCategory = (event) => {
    let showCards = [...this.items];
    if (event.target.value.toLowerCase() !== 'all') {
      showCards = showCards.filter(
        (card) => event.target.value === card.category
      );
    }

    this.setState({ showCards });
  };

  qtyChangeHandler = (order, qty) => {
    let newTotal = 0;
    let orders = this.state.orders.map(item => {
      if(item.id === order.id) {
        item.qty = qty
      }
      order.subTotal = order.price * order.qty
      newTotal += item.subTotal 
      return item;
    })
    this.setState({
      orders: orders,
      total: newTotal
    })
  }

  render() {
    let MenuCards = this.state.showCards.map((item) => {
      return (
        <MenuCard
          key={item._id}
          name={item.name}
          price={item.price}
          image={item.image}
          id={item._id}
          item={item}
          editItem={this.editItem}
          click={() => this.orderClicked(item)}
        />
      );
    });


    return (
      <div className="App">
        <h1>Restaurant App</h1>
          {
            this.state.errorMessage
          }
          {
            (this.state.loginUser === null) ? 
                    (<div>
                        <LoginForm loginFn={this.loginFn} errorMessageFn={this.errorMessageFn}/> <RegistrationForm />
                    </div>)
                 : 
                  (<div>
                      <button onClick={this.logoutFn}>Log out</button>
                  {this.state.loginUser.role === 'admin' ? 
                    <AddItem categories={this.categories} addItem={this.addItem}/> : ""}
                  
                    {
                      (this.state.editItem !== null)?
                          <EditItem categories={this.categories} editItem={this.state.editItem} editItemFunction={this.updatedItem}/>: ""
                    }
                    <OrderTypeSelector
                      categories={this.categories}
                      changeCategory={this.changeCategory}
                    />
                    <div className="restaurant">
                      <div className="menu">{MenuCards}</div>
                      <OrderCart orders={this.state.orders} total={this.state.total} qtyChangeHandler={this.qtyChangeHandler} checkout={this.checkout}/>
                    </div>
                  </div>)
          }
      </div>
      
    );
  }
}

export default App;
