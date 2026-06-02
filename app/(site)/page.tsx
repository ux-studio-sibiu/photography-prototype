import { redirect } from "next/navigation";

// Default to the black variant.
export default function Home() {
  redirect("/black");
}
