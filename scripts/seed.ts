import { NewUser, createUser } from "@/lib/db";

async function main() {
  const newUser: NewUser = {
    email: "stef@example.com",
    image: "stef image",
    name: "stef",
  };
  const res = await createUser(newUser);
  console.log(res);
  process.exit();
}

main();
