import type { LinksFunction, LoaderFunction } from "remix";
import { Outlet, Link, useLoaderData } from "remix";
import stylesUrl from "../styles/jokes.css";
import { db } from "~/utils/db.server";
import { Joke, Prisma } from "@prisma/client";

type LoaderData = {
  jokesListItems: Array<Pick<Joke, "id" | "name">>;
};

export let links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl,
    },
  ];
};

export let loader: LoaderFunction = async () => {
  let jokesListItems = await db.joke.findMany({
    select: {
      id: true,
      name: true,
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });
  const data: LoaderData = { jokesListItems };
  return data;
};

export default function JokesRoute() {
  let { jokesListItems } = useLoaderData<LoaderData>();
  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {jokesListItems.map((joke) => (
                <li key={joke.id}>
                  <Link to={joke.id}>{joke.name}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
