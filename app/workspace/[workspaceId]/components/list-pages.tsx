export default function ListPage({ workspaceId }: { workspaceId: string }) {
  return (
    <div>
      <h1>Workspace {workspaceId}</h1>
      <div>Récupération des pages du workspace</div>
    </div>
  );
}
