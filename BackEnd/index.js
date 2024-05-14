const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router();
// const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


// Define a schema for the User collection
const userSchema = new mongoose.Schema({
  UserName: String,
  FirstName: String,
  LastName: String,
  UserMobile: String,
  Position: String,
  Password: String,
});
// Create a model for the User collection
const User = mongoose.model('Users', userSchema, 'Users');

// Secret key for JWT
const secretKey = 'your-secret-key';

// Middleware for verifying JWT token
// Middleware for verifying JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ message: 'Authorization token is missing' });
  } else {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'Invalid token' });
      } else {
        req.userId = decoded.userId;
        next();
      }
    });
  }
}


// Login endpoint
app.post('/login', async (req, res) => {
  const { UserName, Password } = req.body;
  
  try {
    // Find all users with the provided UserName
    const users = await User.find({ UserName: { $regex: new RegExp(UserName, 'i') } });

    if (users.length === 0) {
      console.log("User not found");
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }
    console.log(users[0].Password);
    console.log(Password);
    if (users[0].Password != Password || Password === "") {
      console.log("Not Correct");
      res.status(401).json({ message: 'Invalid username or password' });
    } else {
      console.log("Correct");
      // Generate a JWT token
      const token = jwt.sign({ userId: users.id }, secretKey);
      res.json({ token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Protected route
app.get('/purchases', verifyToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});




//SIGNUP Code____________________________



// API endpoint to save new users
app.post('/sign', async (req, res) => {
  console.log("Tessdsdskjdhkjshdkjshkdjs222");
  const {
    UserName,
    FirstName,
    LastName,
    UserMobile,
    Position,
    Password,
  } = req.body;
  console.log(req.body);
  console.log("Tessdsdskjdhkjshdkjshkdjs");

  try {
    // Check if the username already exists in the database
    // const existingUser = await User.findOne({ username });
    const existingUser = await User.find({ UserName: { $regex: new RegExp(UserName, 'i') } });
    console.log(existingUser);
    if (existingUser.length !=0) {
      console.log("Username already exists");
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    this.elementRef.nativeElement.querySelectorAll('.k-selected').forEach((element: elementRef)=>{
      this.renderer.removeClass(element, 'k-selected');
    })
    // Create a new user object
    const newUser = new User({
      UserName,
      FirstName,
      LastName,
      UserMobile,
      Position,
      Password
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // You can also generate and return a JWT token here if needed
    // const token = jwt.sign({ userId: savedUser._id }, secretKey);
    // res.json({ token });
    console.log("User created successfully");
    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


  //Purchases details database

  // Connect to MongoDB
mongoose.connect('mongodb+srv://kkp:Abc12345@cluster0.umcorwy.mongodb.net/Inventory_Database?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


  const purchaseSchema = new mongoose.Schema({
    PurchaseID: String,
    ProductID: String,
    BatchNumber: String,
    Quantity: String,
    DateofOrder: String,
    SupplierID: String,
    DateReceived: String,
    Payment: String,
  });
  

// Create a model for your collection
const Purchase = mongoose.model('Inventory_Database', purchaseSchema, 'Purchases');


// API endpoint to get purchases
app.get('/purchasesdata', async (req, res) => {
  console.log(Purchase.String)
  Purchase.find({}).exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Endpoint to add a new purchase
app.post('/addpurchase', async (req, res) => {
  try {
    const newPurchaseData = req.body;
    console.log(req.body);

    // Create a new Purchase document using the data sent from the frontend
    const newPurchase = new Purchase(newPurchaseData);

    // Save the new Purchase document to the database
    await newPurchase.save();

    res.status(200).json(newPurchase);
  } catch (error) {
    console.error('Error adding purchase:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to get the count of all purchases
app.get('/api/purchases/count', async (req, res) => {
  try {
    const count = await Purchase.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching product count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})
// const salesSchema = new mongoose.Schema({
//   TransactionID: String,
//   ProductID: String,
//   UserName: String,
//   Date: String,
//   TotalQuantity: String,
//   TotalAmount: String,
// });

// Define a schema for the Sales collection
const salesSchema = new mongoose.Schema({
  TransactionID: String,
  UserName: String,
  Date: String,
  TotalQuantity: Number,
  TotalAmount: String,
  products: [
    {
      ProductID: String,
      ProductName: String,
      Quantity: Number,
      Price: String,
    },
  ],
});


// // Create a model for your collection
const Sales = mongoose.model('Sales', salesSchema, 'Sales');

// API endpoint to get sales
app.get('/salesdata', async (req, res) => {
  Sales.find({}).exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});



// API endpoint to submit sales data
app.post('/addedsalesdata', async (req, res) => {
  const salesData = req.body;

  try {
    // Save the sales data to the Sales collection
    const savedSales = await Sales.create(salesData);

    res.json(savedSales);
  } catch (error) {
    console.error('Error saving sales data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get the count of all sales
app.get('/api/sales/count', async (req, res) => {
  try {
    const count = await Sales.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching product count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})


const productsSchema = new mongoose.Schema({
  ProductID: String,
  BatchNumber: String,
  ProductName: String,
  ProductBrand: String,
  VehicleBrand: String,
  VehicleModel: String,
  ManufactureYear: String,
  Location: String,
  Quantity: String,
  BuyingPrice: String,
  Price: String
});


// // Create a model for your collection
const Products = mongoose.model('Products', productsSchema, 'Products');

// API endpoint to get sales
app.get('/productsdata', async (req, res) => {
  Products.find({}).exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// API endpoint to get product details by ProductID
app.get('/product/:BatchNumber', async (req, res) => {
  const { BatchNumber } = req.params;

  try {
    // Find the product based on the provided ProductID
    const product = await Products.findOne({ BatchNumber: BatchNumber });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Endpoint to reduce product quantity
app.post('/reduceproductquantity', async (req, res) => {
  try {
    const reduceData = req.body;

    // Validate quantity for each product
    const invalidProducts = reduceData.filter((item) => {
      const quantityToReduce = parseInt(item.quantity, 10);
      return isNaN(quantityToReduce) || quantityToReduce <= 0;
    });

    if (invalidProducts.length > 0) {
      console.log('Invalid quantity value');
      return res.status(400).json({ error: 'Invalid quantity value' });
    }

    const promises = reduceData.map(async (item) => {
      const { BatchNumber, quantity } = item;

      // Find the product by BatchNumber
      const product = await Products.findOne({ BatchNumber: BatchNumber });
      if (!product) {
        console.log('Product not found');
        return null;
      }

      // Parse the Quantity field to a number
      const currentQuantity = parseInt(product.Quantity, 10);

      // Check if the requested quantity is available
      if (currentQuantity < quantity) {
        console.log('Insufficient product quantity');
        return null;
      }

      // Reduce the product quantity and save the updated product
      product.Quantity = (currentQuantity - parseInt(quantity, 10)).toString();
      return product.save();
    });

    const updatedProducts = await Promise.all(promises);
    const successfulUpdates = updatedProducts.filter((product) => product !== null);

    if (successfulUpdates.length === reduceData.length) {
      res.status(200).json({ message: 'Product quantities reduced successfully' });
    } else {
      res.status(500).json({ error: 'Error reducing product quantities' });
    }
  } catch (error) {
    console.error('Error reducing product quantity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




app.post('/increaseproductquantity', async (req, res) => {
  try {
    const { BatchNumber, quantity } = req.body;
    console.log(BatchNumber)
    // Validate the quantity
    const quantityToAdd = parseInt(quantity, 10);
    if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
      console.log('Invalid quantity value');
      return res.status(400).json({ error: 'Invalid quantity value' });
    }

    // Find the product in the 'quantity' collection
    const product = await Products.findOne({ BatchNumber: BatchNumber });
    console.log(product)
    const currentQuantity = parseInt(product.Quantity, 10);

    if (product) {
      // Increment the quantity
      //product.Quantity += product.Quantity+ quantityToAdd;
      product.Quantity = (currentQuantity + parseInt(quantity, 10)).toString();
      await product.save();
    } else {
      // If the product is not found, create a new entry in the 'quantity' collection
      await product.create({ _id: BatchNumber, quantity: quantityToAdd });
    }

    res.status(200).json({ message: 'Quantity updated successfully' });
  } catch (error) {
    console.error('Error increasing quantity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to add a new product
app.post('/addproduct', async (req, res) => {
  try {
    // Get the new product data from the request body
    const newProductData = req.body;
    console.log(req.body);

    // Create a new Purchase document using the data sent from the frontend
    const newProduct = new Products(newProductData);

    // Save the new Purchase document to the database
    await newProduct.save();

    res.status(200).json(newProduct);

  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// API endpoint to delete a product by ProductID
app.delete('/deleteproduct/:BatchNumber', async (req, res) => {
  const BatchNumber = req.params.BatchNumber;
  console.log(BatchNumber)
  try {
    // Find and delete the product by ProductID using the Mongoose model
    const result = await Products.deleteOne({ BatchNumber: BatchNumber });

    if (result.deletedCount === 1) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// Route to get the count of all products
app.get('/api/products/count', async (req, res) => {
  try {
    const count = await Products.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching product count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})


// // API endpoint to update a product by ProductID
// app.put('/updateproduct/:BatchNumber', async (req, res) => {
//   const BatchNumber = req.params.BatchNumber;
//   const updateData = req.body;
//   console.log(BatchNumber, updateData);

//   try {
//     // Find the product by ProductID and update it with the provided data
//     const updatedProduct = await Products.findOneAndUpdate(
//       { BatchNumber: BatchNumber }, // Filter: Find the product with the specified ProductID
//       updateData, // Update: The data you want to update, e.g., { ProductName: 'New Name', Quantity: 50 }
//       { new: true } // Option: Return the updated document after the update
//     ).exec();

//     if (!updatedProduct) {
//       // If the product with the specified ProductID is not found, return an error response
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Return the updated product
//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     console.error('Error updating product:', error);
//     res.status(500).json({ message: 'Error updating product' });
//   }
// });


  // API endpoint to update a product by BatchNumber
  app.put('/updateproduct/:BatchNumber', async (req, res) => {
    const BatchNumber = req.params.BatchNumber;
    const updateData = req.body;
    console.log(BatchNumber, updateData);

    try {
      // Find the product by BatchNumber
      const product = await Products.findOne({ BatchNumber: BatchNumber });

      if (!product) {
        // If the product with the specified BatchNumber is not found, return an error response
        return res.status(404).json({ message: 'Product not found' });
      }

      // Update the product with the provided data
      product.set(updateData);
      await product.save();

      // Return the updated product
      res.status(200).json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Error updating product' });
    }
  });


const suppliersSchema = new mongoose.Schema({
  SupplierID: String,
  SupplierName: String,
  SupplierAddress: String,
  SupplierMail: String,
  SupplierTel: String,
});


const Suppliers = mongoose.model('Suppliers', suppliersSchema, 'Suppliers');

// API endpoint to get Suppliers
app.get('/suppliersdata', async (req, res) => {
  Suppliers.find({}).exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});


// Endpoint to add a new product
app.post('/addsupplier', async (req, res) => {
  try {
    // Get the new product data from the request body
    const newSupplierData = req.body;
    console.log(req.body);

    // Create a new Purchase document using the data sent from the frontend
    const newSupplier = new Suppliers(newSupplierData);

    // Save the new Purchase document to the database
    await newSupplier.save();

    res.status(200).json(newSupplier);

  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// API endpoint to delete a product by ProductID
app.delete('/deletesupplier/:SupplierID', async (req, res) => {
  const SupplierID = req.params.SupplierID;
  console.log(SupplierID)
  console.log(req.body)
  try {
    // Find and delete the product by ProductID using the Mongoose model
    const result = await Suppliers.deleteOne({ SupplierID: SupplierID });

    if (result.deletedCount === 1) {
      res.json({ message: 'Supplier deleted successfully' });
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    console.error('Error deleting Supplier:', error);
    res.status(500).json({ message: 'Error deleting Supplier' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});