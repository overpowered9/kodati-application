import User from './user';
import Transaction from './transaction';
import Product from './product';
import Order from './order';
import Provider from './provider';
import OrderItem from './orderitem';
import AdminLinkedProduct from './adminlinkedproduct';
import MerchantLinkedProduct from './merchantlinkedproduct';
import Card from './card';
import Log from './log';
import Category from './category';
import CategoryProduct from './categoryproduct';
import Region from './region';
import ProductRegion from './productregion';
import PasswordToken from './passwordtoken';
import Customer from './customer';
import EmailTemplate from './emailtemplate';
import Notification from './notification';
import Cart from './cart';
import CartItem from './cartitem';

User.hasMany(Transaction, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Transaction.belongsTo(User, {
    foreignKey: 'user_id', // This links the user_id in Transaction to the id in the User model
    onDelete: 'CASCADE', // Delete the Transaction record if the associated User is deleted
});

Order.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

User.hasMany(Order, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Order.hasMany(OrderItem, {
    foreignKey: 'order_id',
    onDelete: 'CASCADE',
});

OrderItem.belongsTo(Order, {
    foreignKey: 'order_id',
    onDelete: 'CASCADE',
});

Product.hasMany(OrderItem, {
    foreignKey: 'local_product_id',
    onDelete: 'CASCADE',
});

OrderItem.belongsTo(Product, {
    foreignKey: 'local_product_id',
    onDelete: 'CASCADE',
});

Provider.hasMany(AdminLinkedProduct, {
    foreignKey: 'provider_id',
    onDelete: 'CASCADE',
});

AdminLinkedProduct.belongsTo(Provider, {
    foreignKey: 'provider_id',
    onDelete: 'CASCADE',
});

Product.hasMany(AdminLinkedProduct, {
    foreignKey: 'local_product_id',
    onDelete: 'CASCADE',
});

AdminLinkedProduct.belongsTo(Product, {
    foreignKey: 'local_product_id',
    onDelete: 'CASCADE',
});

Product.hasMany(MerchantLinkedProduct, {
    foreignKey: 'local_product_id',
    onDelete: 'CASCADE',
});

MerchantLinkedProduct.belongsTo(Product, {
    foreignKey: 'local_product_id',
    onDelete: 'CASCADE',
});

User.hasMany(MerchantLinkedProduct, {
    foreignKey: 'merchant_id',
    onDelete: 'CASCADE',
});

MerchantLinkedProduct.belongsTo(User, {
    foreignKey: 'merchant_id',
    onDelete: 'CASCADE',
});

OrderItem.hasMany(Card, {
    foreignKey: 'order_item_id',
    onDelete: 'CASCADE',
});

Card.belongsTo(OrderItem, {
    foreignKey: 'order_item_id',
    onDelete: 'CASCADE',
});

User.hasMany(Log, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Log.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Category.belongsToMany(Product, {
    through: CategoryProduct,
    foreignKey: 'category_id'
});

Product.belongsToMany(Category, {
    through: CategoryProduct,
    foreignKey: 'product_id'
});

Region.belongsToMany(Product, {
    through: ProductRegion,
    foreignKey: 'region_id'
});

Product.belongsToMany(Region, {
    through: ProductRegion,
    foreignKey: 'product_id'
});

Order.belongsTo(Transaction, {
    foreignKey: 'transaction_id',
    onDelete: 'CASCADE',
});

Transaction.hasOne(Order, {
    foreignKey: 'transaction_id',
    onDelete: 'CASCADE',
});

PasswordToken.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

User.hasOne(PasswordToken, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Customer.hasMany(Order, {
    foreignKey: 'customer_id',
    onDelete: 'CASCADE',
});

Order.belongsTo(Customer, {
    foreignKey: 'customer_id',
    onDelete: 'CASCADE',
});

EmailTemplate.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

User.hasOne(EmailTemplate, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

User.hasMany(Notification, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Notification.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Cart.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

User.hasOne(Cart, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Cart.hasMany(CartItem, {
    foreignKey: 'cart_id',
    onDelete: 'CASCADE',
});

CartItem.belongsTo(Cart, {
    foreignKey: 'cart_id',
    onDelete: 'CASCADE',
});

Product.hasMany(CartItem, {
    foreignKey: 'product_id',
    onDelete: 'CASCADE',
});

CartItem.belongsTo(Product, {
    foreignKey: 'product_id',
    onDelete: 'CASCADE',
});

export { User, Transaction, Product, Order, Provider, OrderItem, AdminLinkedProduct, MerchantLinkedProduct, Card, Log, Category, CategoryProduct, Region, ProductRegion, PasswordToken, Customer, EmailTemplate, Notification, Cart, CartItem };