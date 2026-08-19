const SERVER_BASE = ((import.meta.env.VITE_API_URL as string) || "http://localhost:5000/api").replace(/\/api\/?$/, "");

export async function uploadFile(file: File): Promise<{ success: boolean; url?: string; filename?: string; message?: string }> {
  const token = localStorage.getItem("felizardos_token");
  const form = new FormData();
  form.append("file", file);

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${SERVER_BASE}/api/uploads`, {
    method: "POST",
    body: form,
    headers,
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    return { success: false, message: json?.message || `Upload failed: ${res.status}` };
  }

  const json = await res.json();
  return { success: true, url: json.data.url, filename: json.data.filename };
}

export default { uploadFile };
