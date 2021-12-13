import { Joke } from "@prisma/client";
import * as React from "react";
import { Link } from "remix";

export function JokeDisplay({
  isOwner,
  joke,
  canDelete = true,
}: {
  isOwner: boolean;
  joke: Pick<Joke, "name" | "content">;
  canDelete: boolean;
}) {
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link to=".">{joke.name} Permalink</Link>
      {isOwner ? (
        <form method="post">
          <input type="hidden" name="_method" value="delete" />
          <button type="submit" className="button" disabled={!canDelete}>
            Delete
          </button>
        </form>
      ) : null}
    </div>
  );
}
