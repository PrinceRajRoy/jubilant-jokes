import { LoaderFunction, useLoaderData } from "remix";

export let loader: LoaderFunction = ({ params }) => {
  return {
    id: params.jokeId,
  };
};

export default function JokeIDRoute() {
  const data = useLoaderData();
  return <div>This is a parameterized joke route with {data.id}.</div>;
}
