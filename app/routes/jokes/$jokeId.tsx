import { Joke } from "@prisma/client";
import { Link, LoaderFunction } from "remix";
import { useLoaderData } from "remix";
import { db } from "~/utils/db.server";

type LoaderData = {
  joke: Joke;
};

export let loader: LoaderFunction = async ({ params }) => {
  let joke = await db.joke.findUnique({ where: { id: params.jokeId } });
  if (!joke) throw new Error("Joke not found");
  let data: LoaderData = { joke };
  return data;
};

export default function JokeIDRoute() {
  const { joke } = useLoaderData<LoaderData>();
  return (
    <div>
      <p>This is a parameterized joke route with {joke.content}.</p>
      <Link to=".">{joke.name} Permalink</Link>
    </div>
  );
}
