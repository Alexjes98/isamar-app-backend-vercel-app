const express = require("express");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('./img'))


const upload = multer({
    limits: {
      fileSize: 4 * 1024 * 1024,
    }
});

app.get("/", (req, res) => {
    res.send(`API us up`);
});

app.post("/login", async (req, res) => {
    try {
      const { dni, password } = req.body;
      if (!(dni && password)) {
        res.status(400).send("All input is required");
      }
  
      let dbquery = `SELECT * FROM users WHERE dni=${dni}`;
      const oldUser = await db.query(dbquery);
  
      if (Array.isArray(oldUser) && oldUser.length === 0) {
        return res.status(409).send("User Does not  Exist. Please Register");
      }
      const user = oldUser[0];
  
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { user_id: user.dni, dni },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        user.token = token;
        delete user.password;
        const perm = {
          orders: ["admin", "vendedor", "confeccionista", "almacenista"],
          catalog: ["admin", "vendedor"],
          clothes: ["admin", "confeccionista"],
          materials: ["admin", "almacenista"],
        }
  
        res.status(200).json({ ...user, ...perm });
      } else {
        res.status(400).send("Invalid Credentials");
      }
  
    } catch (err) {
      console.log(err);
    }
  });

app.get('/about', (req, res) => res.send('About Page Route'));

app.get('/portfolio', (req, res) => res.send('Portfolio Page Route'));

app.get('/contact', (req, res) => res.send('Contact Page Route'));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));


module.exports = app;