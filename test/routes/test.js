process.env.NODE_ENV = "test";
const chai = require("chai");
const expect = require("chai").expect;
const chaiHttp = require("chai-http");
const faker = require("faker");
const server = require("../../index");
const jwt = require("jsonwebtoken");
chai.use(chaiHttp);

describe("Users routes", () => {
  const login = "/api/login";
  const register = "/api/register";
  const private = "/api";
  const rating = "/api/users";
  const guest = "/api/guest";
  const guestLogout = guest + "-logout";
  const preSave = {
    username: "faker",
    email: "faker@email.com",
    password: "fakedpassword",
  };
  const existingUser = {
    email: "faker@email.com",
    password: "fakedpassword",
  };
  const newUser = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  let token;
  let newToken;
  let userId;
  let guestToken;
  before((done) => {
    chai
      .request(server)
      .post(register)
      .send(preSave)
      .end((err, response) => {
        expect(response).to.have.status(200);
        token = response.body.msg;
        try {
          userId = jwt.verify(token, process.env.JWT_SECRET).id;
        } catch (error) {
          console.log(err);
        }
        done();
      });
  });
  before((done) => {
    chai
      .request(server)
      .get(guest)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.contain.property("success").to.equal(true);
        expect(res.body).to.contain.property("msg").to.have.string("ey");
        guestToken = res.body.msg;
        done();
      });
  });
  //Register Route
  it("Should register a new user", (done) => {
    chai
      .request(server)
      .post(register)
      .send(newUser)
      .end((err, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.contain.property("success").to.equal(true);
        expect(response.body).to.contain.property("msg");
        newToken = response.body.msg;
        expect(token).to.have.string("ey");
        done();
      });
  });
  it("Should not register a new user (user existing)", (done) => {
    chai
      .request(server)
      .post(register)
      .send(preSave)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.contain.property("success").to.equal(false);
        expect(res.body)
          .to.contain.property("msg")
          .to.be.equal("User already exists, Username & Email must be unique");
        done();
      });
  });
  it("Should not register a new user (duplicate email)", (done) => {
    chai
      .request(server)
      .post(register)
      .send({
        username: faker.internet.userName(),
        email: preSave.email,
        password: faker.internet.password(),
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.contain.property("success").to.equal(false);
        expect(res.body)
          .to.contain.property("msg")
          .to.be.equal("User already exists, Username & Email must be unique");
        done();
      });
  });
  it("Should not register a new user (Missing username)", (done) => {
    chai
      .request(server)
      .post(register)
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.contain.property("success").to.equal(false);
        expect(res.body)
          .to.contain.property("msg")
          .to.be.equal("Please enter a valid username");
        done();
      });
  });
  it("Should not register a new user (Missing email & username)", (done) => {
    chai
      .request(server)
      .post(register)
      .send({
        password: faker.internet.password(),
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.contain.property("success").to.equal(false);
        expect(res.body)
          .to.contain.property("msg")
          .to.be.equal("Please enter a valid username,Please enter an email");
        done();
      });
  });
  it("Should not register a new user (short password)", (done) => {
    chai
      .request(server)
      .post(register)
      .send({
        ...newUser,
        password: "4a8",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.contain.property("success").to.equal(false);
        expect(res.body)
          .to.contain.property("msg")
          .to.be.equal("Password should be longer than 6 characters");
        done();
      });
  });

  //Login Route
  it("Should login an existing user", (done) => {
    chai
      .request(server)
      .post(login)
      .send(existingUser)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.contain.property("success").to.equal(true);
        expect(res.body).to.contain.property("msg").to.have.string("ey");
        done();
      });
  });
  it("Should not login (non existing user)", (done) => {
    chai
      .request(server)
      .post(login)
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.contain.property("success").to.equal(false);
        expect(res.body)
          .to.contain.property("msg")
          .to.be.equal("Could not sign in, please verify your credentials");
        done();
      });
  });
  it("Should not login (wrong existing user password)", (done) => {
    chai
      .request(server)
      .post(login)
      .send({
        email: existingUser.email,
        password: faker.internet.password(),
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.contain.property("success").to.equal(false);
        expect(res.body)
          .to.contain.property("msg")
          .to.be.equal("Could not sign in, please verify your credentials");
        done();
      });
  });
  it("Should not login (missing email)", (done) => {
    chai
      .request(server)
      .post(login)
      .send({
        password: faker.internet.password(),
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.contain.property("success").to.equal(false);
        expect(res.body)
          .to.contain.property("msg")
          .to.be.equal("Please Fill in the form fields");
        done();
      });
  });

  //Private routes
  it("Should authorize", (done) => {
    chai
      .request(server)
      .get(private)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.contain.property("success").to.equal(true);
        expect(res.body)
          .to.contain.property("msg")
          .to.contain.property("id")
          .to.be.equal(userId);
        expect(res.body)
          .to.contain.property("msg")
          .to.contain.property("username")
          .to.be.equal(preSave.username);
        done();
      });
  });
  it("Should authorize (second user)", (done) => {
    chai
      .request(server)
      .get(private)
      .set("Authorization", `Bearer ${newToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.contain.property("success").to.equal(true);
        expect(res.body)
          .to.contain.property("msg")
          .to.contain.property("id")
          .to.have.lengthOf(24);
        expect(res.body)
          .to.contain.property("msg")
          .to.contain.property("username")
          .to.be.equal(newUser.username);
        done();
      });
  });
  it("Should not authorize (missing headers)", (done) => {
    chai
      .request(server)
      .get(private)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.contain.property("success").to.equal(false);
        expect(res.body)
          .to.contain.property("msg")
          .to.be.equal("You are not authorized to access this content");
        done();
      });
  });
  it("Should not authorize (bad token)", (done) => {
    chai
      .request(server)
      .get(private)
      .set("Authorization", "Bearer eyxxxxxxxxxxxxxxxxxxxxxx")
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.contain.property("success").to.equal(false);
        expect(res.body)
          .to.contain.property("msg")
          .to.be.equal("You are not authorized to access this content");
        done();
      });
  });

  //Rating route
  it("Should return user's rating", (done) => {
    chai
      .request(server)
      .get(`${rating}/${userId}/rating`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.contain.property("success").to.equal(true);
        expect(res.body).to.contain.property("msg").to.be.a("number");
        done();
      });
  });
  it("Should not return the user's rating (not authorized)", (done) => {
    chai
      .request(server)
      .get(`${rating}/${userId}/rating`)
      //   .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.contain.property("success").to.equal(false);
        expect(res.body)
          .to.contain.property("msg")
          .to.be.equal("You are not authorized to access this content");
        done();
      });
  });
  it("Should not return the user's rating (bad id)", (done) => {
    chai
      .request(server)
      .get(`${rating}/${userId}X/rating`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.contain.property("success").to.equal(false);
        expect(res.body)
          .to.contain.property("msg")
          .to.be.equal("You are not authorized to access this content");
        done();
      });
  });

  it("Should update the user's rating", (done) => {
    chai
      .request(server)
      .put(`${rating}/${userId}/rating`)
      .set("Authorization", `Bearer ${token}`)
      .send({ gameRating: faker.datatype.number() })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.contain.property("success").to.equal(true);
        expect(res.body)
          .to.contain.property("msg")
          .to.be.a("string")
          .to.be.equal("User rating updated successfully");
        done();
      });
  });
  it("Should not update the user's rating (not authorized)", (done) => {
    chai
      .request(server)
      .put(`${rating}/${userId}/rating`)
      //   .set("Authorization", `Bearer ${token}`)
      .send({ gameRating: faker.datatype.number() })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.contain.property("success").to.equal(false);
        expect(res.body)
          .to.contain.property("msg")
          .to.be.equal("You are not authorized to access this content");
        done();
      });
  });
  it("Should not update the user's rating (bad id)", (done) => {
    chai
      .request(server)
      .put(`${rating}/${userId}X/rating`)
      .set("Authorization", `Bearer ${token}`)
      .send({ gameRating: faker.datatype.number() })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.contain.property("success").to.equal(false);
        expect(res.body)
          .to.contain.property("msg")
          .to.be.equal("You are not authorized to access this content");
        done();
      });
  });
  it("Should not update the user's rating (another user id)", (done) => {
    chai
      .request(server)
      .put(`${rating}/${userId}X/rating`)
      .set("Authorization", `Bearer ${newToken}`)
      .send({ gameRating: faker.datatype.number() })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.contain.property("success").to.equal(false);
        expect(res.body)
          .to.contain.property("msg")
          .to.be.equal("You are not authorized to access this content");
        done();
      });
  });
  it("Should not update the user's rating (missing game rating)", (done) => {
    chai
      .request(server)
      .put(`${rating}/${userId}/rating`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.contain.property("success").to.equal(false);
        expect(res.body)
          .to.contain.property("msg")
          .to.be.a("string")
          .to.be.equal("Could not update this user's rating");
        done();
      });
  });

  //guest routes
  it("Should create a new  user guest", (done) => {
    chai
      .request(server)
      .get(guest)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.contain.property("success").to.equal(true);
        expect(res.body).to.contain.property("msg").to.have.string("ey");
        done();
      });
  });

  it("Should logout a guest user ", (done) => {
    chai
      .request(server)
      .get(guestLogout)
      .set("authorization", `Bearer ${guestToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.contain.property("success").to.equal(true);
        expect(res.body)
          .to.contain.property("msg")
          .to.equal("Guest user was removed from the database");
        done();
      });
  });
});
