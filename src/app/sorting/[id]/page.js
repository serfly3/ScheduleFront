import { PageSort } from "@/app/Components/PageSort/PageSort";

export default async function Home(props) {
  const params = await props.params;
  console.log(params.id);  // это работает, но его нужно передать дальше

  return (
    // Передаем params в PageSort
    <PageSort params={params} />
  );
}
