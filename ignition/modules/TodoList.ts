import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TodoModule = buildModule("TodoModule", (t) => {
  const todo = t.contract("TodoList");

  return { todo };
});

export default TodoModule;
