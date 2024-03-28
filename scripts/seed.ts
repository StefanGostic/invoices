import { NewUser, createUser } from "@/lib/db";

async function main() {
  const newUser: NewUser = {
    email: "foo@example.com",
    image: "amazing image",
    name: "foo",
  };
  const res = await createUser(newUser);
  console.log(res);
  process.exit();
}

main();
