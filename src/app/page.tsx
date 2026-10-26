import { redirect } from "next/navigation";

/** The root route opens the selection gallery. */
export default function Home() {
  redirect("/gallery");
}
