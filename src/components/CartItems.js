import React from 'react';

class CartItems extends React.Component {

    //maybe having a state here
    // state = {
    // value="",   
    //}
    //
    // qtyEditor(e){
    //     let qtyEditor = this.props.qtyChangeHandler;
    //     // console.log('number');
    //     // console.log(e.target.value);
    //     this.setState({orderTotal= event.target.value};);
    //     // for limiting the input numbers use... substr(0,5)
    // }

    render() {
        return (
            <div className="orderChosen" key={this.props.order.id}>
                <span>{this.props.order.name}</span>
                <span>
                    <input 
                        type="number"
                        value={this.props.order.qty}
                        onChange={(e) => this.props.qtyChangeHandler(this.props.order, e.target.value)} 
                        // onChange={(e) => this.qtyEditor.bind(this)}   
                    />
                </span>
                <span>{this.props.order.price} PHP</span>
                <span>{this.props.order.subTotal}</span>
          </div>
        )
    }
}

export default CartItems;