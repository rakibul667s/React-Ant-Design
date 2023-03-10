import React, { useEffect, useState } from "react";
import { Badge, Button, Drawer, Form, InputNumber, Menu, Table, Input, Checkbox, message} from "antd";
import { HomeFilled, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Typography from "antd/es/typography/Typography";
import { getCart } from "../../API";

const AppHeader = () => {
  const navigate = useNavigate();

  const onMenuClick = (item) => {
    navigate(`/${item.key}`);
  };

  return (
    <div className="appHeader">
      <Menu
        className="appMenu"
        mode="horizontal"
        onClick={onMenuClick}
        items={[
          {
            label: <HomeFilled />,
            key: "",
          },
          {
            label: "Men",
            key: "men",
            children: [
              {
                label: " Men's Shirts",
                key: "mens-shirts",
              },
              {
                label: " Men's Shoes",
                key: "mens-shoes",
              },
              {
                label: " Men's Watches",
                key: "mens-watches",
              },
            ],
          },
          {
            label: "Women",
            key: "women",
            children: [
              {
                label: " Women's Dresses",
                key: "womens-dresses",
              },
              {
                label: " Women's Shoes",
                key: "womens-shoes",
              },
              {
                label: " Women's Watches",
                key: "womens-watches",
              },
              {
                label: " Women's Bags",
                key: "womens-bags",
              },
              {
                label: " Women's Jewellery",
                key: "womens-jewellery",
              },
            ],
          },
          {
            label: "Fragrances",
            key: "fragrances",
          },
        ]}
      />
      <Typography.Title className="title" >E-Commerce website</Typography.Title>
      <AppCart />
    </div>
  );
};

function AppCart() {
  const [cartDrawerOpen, setcartDrawerOpen] = useState(false);
  const [ cartItems, setcartItems] = useState();
  const [checkoutDrawerOpen, setCheckoutDrawerOpen] = useState(false);
  useEffect(() => {
    getCart().then((res) => {
      setcartItems(res.products);
    });
  },[]);

  const onConfirmOrder = (values) => {
      console.log(values);
      setcartDrawerOpen(false);
      setcartDrawerOpen(false);
      message.success("Your order has been placed successfully ")
  }
  return (
    <div>
      <Badge
        onClick={() => {
          setcartDrawerOpen(true);
        }}
        count={7}
        className="shoppingCartIcon"
      >
        {" "}
        <ShoppingCartOutlined />
      </Badge>
      <Drawer
        open={cartDrawerOpen}
        onClose={() => {
          setcartDrawerOpen(false);
        }}
        title="Your Cart"
        contentWrapperStyle={{width:500}}
      >
        <Table 
        pagination={false}
         columns={[
          {
            title:'Title',
            dataIndex:'title',
          },
          {
            title:'Price',
            dataIndex:'price',
            render:(value)=>{
              return <span>${value}</span>
            }
          },
          {
            title:'Quantity',
            dataIndex:'quantity',
            render:(value, record)=>{
              return <InputNumber min={0} defaultValue={value} onChange={(value)=>{
               setcartItems(pre=> pre.map(cart=>{
                  if(record.id === cart.id){
                    cart.total = cart.price * value
                  }
                  return cart
                }))
              }}></InputNumber>
            }
          },
          {
            title:'Total',
            dataIndex:'total',
            render:(value)=>{
              return <span>${value}</span>
            }
          }
        ]}
        dataSource={cartItems}
        summary={(data)=>{
         const total = data.reduce((pre, current)=>{
            return pre+current.total
          },0)
          return <span>Total: {total}</span>
        }}
        />
        <Button onClick={()=>{
          setCheckoutDrawerOpen(true);
        }} type="primary">Checkout your Cart</Button>
      </Drawer>
      <Drawer open={checkoutDrawerOpen} onClose={()=>{
        setCheckoutDrawerOpen(false)
      }}
      title="Confirm Order"
      >
        <Form onFinish={onConfirmOrder}>
          <Form.Item rules={[
            {
              required: true,
              message: 'Please enter your full name',
            }
          ]} label='Full Name' name='full_name'>
            <Input placeholder="Enter your Full Name" />
          </Form.Item>
          <Form.Item rules={[
            {
              required: true,
              type:'email',
              message: 'Please enter your valid email',
            }
          ]} label='Email' name='email'>
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item rules={[
            {
              required: true,
              message: 'Please enter your Address',
            }
          ]} label='Address' name='address'>
            <Input placeholder="Enter your Address" />
          </Form.Item>
          <Form.Item>
            <Checkbox defaultChecked disabled>Cash on Delivery</Checkbox>
          </Form.Item>
          <Typography.Paragraph type="secondary">
              More methods coming soon
          </Typography.Paragraph>
          <Button type="primary" htmlType="submit">Confirm Order</Button>
        </Form>

      </Drawer>
    </div>
  );
}

export default AppHeader;
