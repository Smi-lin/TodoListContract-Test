import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Todo Test", function () {
  async function deployTodoFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Todo = await hre.ethers.getContractFactory("TodoList");
    const todo = await Todo.deploy();

    return { todo, owner, otherAccount };
  }

  describe("Deployment", () => {
    it("Should check if it deployed ", async function () {
      const { todo, owner } = await loadFixture(deployTodoFixture);

      expect(await todo.owner()).to.equal(owner.address);
    });
  });

  it("Should be able to create Todo as the owner", async function () {
    const { todo, owner } = await loadFixture(deployTodoFixture);
    const title = "Hello world!";
    const description = "From DLT Africa";
    await todo.connect(owner).createTodo(title, description);

    const todoItem = await todo.getTodo(0);

    expect(todoItem[0]).to.equal(title);
    expect(todoItem[1]).to.equal(description);
    expect(todoItem[2]).to.equal(1);
  });

  it("Should not be able to create Todo if not owner", async function () {
    const { todo, otherAccount } = await loadFixture(deployTodoFixture);
    const title = "Hello world!";
    const description = "From DLT Africa";
    await expect(
      todo.connect(otherAccount).createTodo(title, description)
    ).to.be.revertedWith("You're not allowed"); 
  });

  it("Should be able to update TodoList as the owner", async function () {
    const { todo, owner } = await loadFixture(deployTodoFixture);

   
    const createTitle = "Hello world!";
    const createDescription = "From DLT Africa";
    await todo.connect(owner).createTodo(createTitle, createDescription);


    const updateTitle = "Updated Hello world!";
    const updateDescription = "Updated from DLT Africa";
    await todo.connect(owner).updateTodo(0, updateTitle, updateDescription);


    const updatedTodo = await todo.getTodo(0);

    expect(updatedTodo[0]).to.equal(updateTitle);
    expect(updatedTodo[1]).to.equal(updateDescription);
    expect(updatedTodo[2]).to.equal(2); 
  });

  it("Should not be able to update TodoList if not owner", async function () {
    const { todo, otherAccount } = await loadFixture(deployTodoFixture);
    const updateTitle = "Hello world!";
    const updateDescription = "From DLT Africa";
    await expect(
      todo.connect(otherAccount).updateTodo(0, updateTitle, updateDescription)
    ).to.be.revertedWith("You're not allowed");
  });

  it("Should be able to allow owner to check if it is completed", async function () {
    const { todo, owner } = await loadFixture(deployTodoFixture);
    const updateTitle = "Welcome to Web3 Class";
    const updateDescription = "From DLT Africa Team";
    await todo.connect(owner).createTodo(updateTitle, updateDescription);

    await todo.connect(owner).updateTodo(0, updateTitle, updateDescription);

    await todo.connect(owner).todoCompleted(0);

    const completedTodo = await todo.getTodo(0);

    expect(completedTodo[0]).to.equal(updateTitle);
    expect(completedTodo[1]).to.equal(updateDescription);
    expect(completedTodo[2]).to.equal(3);
  });

  it("Should not be able another owner to check if it is completed", async function () {
    const { todo, owner, otherAccount } = await loadFixture(deployTodoFixture);
    const updateTitle = "Hello world!";
    const updateDescription = "From DLT Africa";

    await todo.connect(owner).createTodo(updateTitle, updateDescription);

    await expect(
      todo.connect(otherAccount).updateTodo(0, updateTitle, updateDescription)
    ).to.be.revertedWith("You're not allowed");
  });

  it("Should be able to get All the Todo Lists", async function () {
    const { todo, owner } = await loadFixture(deployTodoFixture);

  
    const createTitle1 = "Hello world!";
    const createDescription1 = "From DLT Africa";
    await todo.connect(owner).createTodo(createTitle1, createDescription1);

    const createTitle2 = "Web3 Class!";
    const createDescription2 = "From Blockchain Africa";
    await todo.connect(owner).createTodo(createTitle2, createDescription2);

    const createTitle3 = "About";
    const createDescription3 = "Web3 Developers";
    await todo.connect(owner).createTodo(createTitle3, createDescription3);

    const todos = await todo.getAllTodo();

    expect(todos.length).to.equal(3);
    expect(todos[0][0]).to.equal(createTitle1);
    expect(todos[0][1]).to.equal(createDescription1);
    expect(todos[0][2]).to.equal(1);

    expect(todos[1][0]).to.equal(createTitle2);
    expect(todos[1][1]).to.equal(createDescription2);
    expect(todos[1][2]).to.equal(1);

    expect(todos[2][0]).to.equal(createTitle3);
    expect(todos[2][1]).to.equal(createDescription3);
    expect(todos[2][2]).to.equal(1);
  });

  it("Should be able to delete todo as owner", async function () {
    const { todo, owner } = await loadFixture(deployTodoFixture);

    const title = "Deleting todo";
    const description = "Todos deleted";

    await todo.connect(owner).createTodo(title, description);
    await todo.connect(owner).deleteTodo(0);

    const todos = await todo.getAllTodo();

    expect(todos.length).to.equal(0);
  });

  it("Should not be able allow another owner to delete todos", async function () {
    const { todo, owner, otherAccount } = await loadFixture(deployTodoFixture);

    const title = "Deleting todo";
    const description = "Todos deleted";

    await todo.connect(owner).createTodo(title, description);

    await expect(
      todo.connect(otherAccount).deleteTodo(0)
    ).to.be.revertedWith("You're not allowed");
  });

});
