export default async function Page({
  params,
}: {
  params: Promise<{ workspaceId: string; pageId: string }>;
}) {
  const { workspaceId, pageId } = await params;
  return (
    <div>
      <h1>Page {pageId}</h1>
      <div>Récupération des tâches de la page</div>
      <div>Workspace ID: {workspaceId}</div>
    </div>
  );
}
