import { useState, useEffect } from "react";
import ErrorMessage from "../atoms/errorMessage";
import LoadingMessage from "../atoms/loadingMessage";

export default function DataFetcher({ url }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, { signal });
        if (!response.ok) {
          throw new Error("Error en la peticion");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => controller.abort();
  }, [url]);

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  return (
    <div>
      <h1>Data Obtenida</h1>
      <div>
        {data.map((item) => (
          <div key={item.id}>
            <label>Nombre:</label>
            <input type="text" value={item.name} readOnly />

            <label>User:</label>
            <input type="text" value={item.username} readOnly />

            <label>Correo:</label>
            <input type="email" value={item.email} readOnly />
          </div>
        ))}
      </div>
    </div>
  );
}
